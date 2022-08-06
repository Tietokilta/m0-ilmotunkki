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
const ItemList: React.FC = () => {
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
    <div className='grid grid-cols-3 gap-8 my-8'>
      {itemCategories?.sort((a,b) => a.id-b.id).map(category => 
        category.attributes.itemTypes.data.filter(item => {
          if(category.attributes.overflowItem.data?.id !== item.id) return true;
          return category.attributes.currentQuantity >= category.attributes.maximumItemLimit;
        }).map(item => 
        <div onClick={() => handleClick(item, category)} key={item.id} 
            className='text-center shadow shadow-gray-400 cursor-pointer transition hover:bg-gray-50'>
          <p>
            {item.attributes.slug}
          </p>
          <p className='text-gray-500'>{item.attributes.price} €</p>
          <p className='text-gray-500'>{itemCount(items, item.id)} kpl</p>
          {isSoldOut(item, category) && <p>Loppuunmyyty</p>}
          <button
            onClick={(e) => handleDelete(e,item)}
            className='btn'
            disabled={itemCount(items, item.id) === 0}
            >-</button>
        </div>)
      )}
    </div>
  );
}

export default ItemList