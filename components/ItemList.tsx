import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Item, ItemCategory, ItemType } from "../utils/models";
import useSWR from 'swr';
import { fetchAPI } from '../lib/api';

const itemCount = (items: Item[], itemId: number) => items.filter(
  ({
    attributes: {
      itemType: {
        data
      }
    }
  }) => data.id === itemId).length;

const isSoldOut = (itemType: ItemType, category: ItemCategory) => {
  if(category.attributes.overflowItem.data?.id === itemType.id) return false;
  return category.attributes.currentQuantity >= category.attributes.maximumItemLimit;
}
const ItemList: React.FC<{translation: Record<string,string>}> = ({translation}) => {
  const {data: itemCategories, mutate: mutateCategories} = useSWR('/item-categories', url => fetchAPI<ItemCategory[]>(url,{},{
    populate: ['overflowItem','itemTypes'],
  }));
  const { addItem, deleteItem, items } = useContext(AppContext);
  const handleClick = async (item: ItemType, category: ItemCategory) => {
    item.attributes.itemCategory = {data: category};
    await addItem(item);
    mutateCategories();
  };
  const handleDelete = async (event: any, item: ItemType) => {
    event.stopPropagation();
    await deleteItem(item.id);
    mutateCategories();
  }
  return (
    <div >
      {itemCategories?.sort((a,b) => a.id-b.id).map(category => 
        category.attributes.itemTypes.data.filter(item => {
          if(category.attributes.overflowItem.data?.id !== item.id) return true;
          return category.attributes.currentQuantity >= category.attributes.maximumItemLimit;
        }).map(item => 
        <div key={item.id} 
            className='flex gap-2 text-center border-b-2 border-b-gray-200 mb-4 last:border-none items-center'>
          <p className='flex-1'>
            {translation[item.attributes.slug]}
          </p>
          <p className='text-gray-500 flex-1'>{item.attributes.price} €</p>
          {isSoldOut(item, category) && <p>{translation.soldOut}</p>}
          <div className='flex-1 gap-4 flex items-center'>
            <button
              onClick={(e) => handleDelete(e,item)}
              className='btn mb-4'
              disabled={itemCount(items, item.id) === 0}
              >
              -
            </button>
            <p className='text-gray-500 mb-4'>{itemCount(items, item.id)}</p>
            <button
              onClick={() => handleClick(item, category)}
              className='btn mb-4'
              >
              +
            </button>
          </div>
        </div>)
      )}
    </div>
  );
}

export default ItemList