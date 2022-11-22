import { ChangeEvent, KeyboardEvent, useEffect, useState, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { fetchAPI } from "../lib/api";
import { Group } from '../utils/models';

import Crossicon from '../public/cross.svg';
import Image from 'next/image';

type PropTypes = {
  onChange: (event: Pick<ChangeEvent<HTMLInputElement>,'target'>) => void;
}
const GroupComponent = ({onChange}: PropTypes) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [newGroupName, setGroupName] = useState('');
  const inputElement = useRef<HTMLInputElement>(null);
  const {data: groupData} = useSWR<Group[]>('/groups', fetchAPI);
  const groups = useMemo(() => (groupData ||[]).map(group => group.attributes.name),[groupData])
  const [dropdownIndex, setDropdownIndex] = useState(-1);
  const [isFocused, setFocused] = useState(false);
  const filteredGroups = useMemo(() => {
    const g = groups.filter(group => {
      if(newGroupName.length === 0) return false;
      const inList = group.toLocaleLowerCase()
      .indexOf(newGroupName.toLocaleLowerCase()) >= 0 && !selectedGroups.includes(group);
      return inList
    });
    if(g.indexOf(newGroupName) >= 0) return g;
    return [newGroupName, ...g];
  }
  , [groups, newGroupName, selectedGroups]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  }
  const handleBlur = () => {
    addGroup(newGroupName);
    setFocused(false);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch(e.key) {
      case 'Tab':
      case ',':
        if(newGroupName.length === 0) return;
        e.preventDefault();
        if(dropdownIndex < 0) {
          addGroup(newGroupName);
          return;
        }
        addGroup(filteredGroups[dropdownIndex]);
        break;
      case 'Enter':
        e.preventDefault();
        if(dropdownIndex < 0) {
          addGroup(newGroupName);
          return;
        }
        addGroup(filteredGroups[dropdownIndex]);
        break;
      case 'Backspace':
        if(newGroupName.length === 0) {
          setSelectedGroups(selectedGroups.slice(0,-1));
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        setDropdownIndex(previousIndex => Math.min(previousIndex + 1, filteredGroups.length-1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setDropdownIndex(previousIndex => Math.max(previousIndex - 1,-1));
        break;
    }
  }

  const addGroup = (groupName: string) => {
    if(!groupName || selectedGroups.indexOf(groupName) >= 0) return
    setGroupName('');
    setDropdownIndex(-1);
    setSelectedGroups([...selectedGroups, groupName]);
    if(!inputElement.current)return;
    const event: Pick<ChangeEvent<HTMLInputElement>,'target'> = {
      target: {
        ...inputElement.current,
        value: [newGroupName, ...selectedGroups].join(','),
      }
    }
    onChange(event);
  }
  const removeGroup = (groupName: string) => {
    const newGroups = selectedGroups.filter(group => group !== groupName);
    setSelectedGroups(newGroups);
  }

  const handleClick = (group: string) => {
    addGroup(group);
    const { current } = inputElement;
    if(!current) return;
    setTimeout(() => current.focus(),200);
  }

  return (
    <div className="flex gap-1 border-b-2 border-b-primary-700 dark:border-b-primary-200 w-full flex-wrap mt-2">
      {selectedGroups.map(group => 
      <div
        className='bg-primary-700 dark:bg-primary:200 text-secondary-50 rounded-md px-3 flex gap-1 whitespace-nowrap justify-center items-center'
        key={group}>
        {group}
        <span
          className='cursor-pointer w-3 h-3 opacity-70 hover:opacity-100 mb-3'
          onClick={() => removeGroup(group)}>
          <Image height={12} width={12} src={Crossicon} alt="remove"/>
        </span>
      </div>)}
      <div className='flex-1 relative max-w-[300px]'>
        <input
          className="bg-transparent border-0 focus:outline-none w-full"
          ref={inputElement}
          value={newGroupName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}/>
        {newGroupName.length > 0 && filteredGroups.length > 0 &&
        <div
          className='absolute right-0 top-[100%] min-w-[300px] z-10 bg-secondary-50 rounded shadow-md p-2'
        >
          {filteredGroups.map((group,idx) =>
            <div
            className='selected p-2 cursor-pointer hover:bg-primary-700 hover:text-secondary-50 border-b-2 '
            onMouseDown={() => handleClick(group)}
            onTouchStart={() => handleClick(group)}
            key={group}
            >
            <style jsx>{`
              .selected {
                  ${idx===dropdownIndex && `background-color: rgb(3,105,161); color: rgb(248, 250, 252)`}
                }
            `}</style>
              {group}
            </div>
          )}
        </div>}
      </div>
    </div>
  )
}



export default GroupComponent;