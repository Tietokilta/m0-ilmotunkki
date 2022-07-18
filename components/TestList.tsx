import styled from 'styled-components';
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Item, ItemCategory, ItemType } from "../utils/models";
import useSWR from 'swr';
import { fetchAPI } from '../lib/api';


const ItemWrapper = styled.div`
  text-align: center;
  box-shadow: 0 1px 2px hsl(0, 0%, 35%);
  width: 100%;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  gap: 32px;
`;

const ItemLabel = styled.p`
  font-size: 1rem;
`;

const ItemPrice = styled.p`
  color: hsl(0, 0%, 35%);
`;

const ItemCount = styled.p`
  color: hsl(0, 0%, 34.90196078431372%);
`;

const DeleteItem = styled.button`

`;
const itemCount = (items: Item[], itemId: number) => items.filter(
  ({
    attributes: {
      itemType: {
        data
      }
    }
  }) => data.id === itemId).length;

const isSoldOut = (itemType: ItemType, itemCategories: ItemCategory[]) => {
  const category = itemCategories.find(c => c.id === itemType.attributes.itemCategory.data.id);
  if(!category) return true;
  if(category.attributes.overflowItem.data?.id === itemType.id) return false;
  return category.attributes.currentQuantity >= category.attributes.maximumItemLimit;
}
const ItemList: React.FC = () => {
  const {data: itemTypes} = useSWR('/item-types', url => fetchAPI<ItemType[]>(url,{},{
    populate: ['itemCategory'],
  }), {suspense: true});
  const {data: itemCategories, mutate: mutateCategories} = useSWR('/item-categories', url => fetchAPI<ItemCategory[]>(url,{},{
    populate: ['overflowItem'],
  }), {suspense: true});
  const { addItem, deleteItem, items } = useContext(AppContext);
  if(!itemTypes || !itemCategories) return null;
  const handleClick = async (item: ItemType) => {
    await addItem(item);
    mutateCategories();
  };
  const handleDelete = async (event: any, item: ItemType) => {
    event.stopPropagation();
    await deleteItem(item.id);
    mutateCategories();
  }
  return (
    <ItemContainer>
      {itemTypes.filter(item => {
        // Do not show reserve, unless soldOut and empty cart
        const categoryId = item.attributes.itemCategory.data.id;
        const category = itemCategories.find(c => c.id === categoryId);
        if (!category) return false;
        const overflowItem = category.attributes.overflowItem.data;
        const isOverflowItem = overflowItem?.id === item.id;
        if(!isOverflowItem) return true;
        const soldOut = category.attributes.currentQuantity >= category.attributes.maximumItemLimit;
        return soldOut;
      }).map(item =>
      <ItemWrapper onClick={() => handleClick(item)} key={item.id}>
        <ItemLabel>
          {item.attributes.slug}
        </ItemLabel>
        <ItemPrice>{item.attributes.price} €</ItemPrice>
        <ItemCount>{itemCount(items, item.id)} kpl</ItemCount>
        {isSoldOut(item, itemCategories) && <ItemLabel>Loppuunmyyty</ItemLabel>}
        <DeleteItem onClick={(e) => handleDelete(e,item)}>-</DeleteItem>
      </ItemWrapper>)} 
    </ItemContainer>
  );
}

export default ItemList