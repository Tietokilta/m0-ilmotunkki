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
    <ItemContainer>
      {itemCategories?.sort((a,b) => a.id-b.id).map(category => 
        category.attributes.itemTypes.data.filter(item => {
          if(category.attributes.overflowItem.data?.id !== item.id) return true;
          return category.attributes.currentQuantity >= category.attributes.maximumItemLimit;
        }).map(item => 
          <ItemWrapper onClick={() => handleClick(item, category)} key={item.id}>
        <ItemLabel>
          {item.attributes.slug}
        </ItemLabel>
        <ItemPrice>{item.attributes.price} €</ItemPrice>
        <ItemCount>{itemCount(items, item.id)} kpl</ItemCount>
        {isSoldOut(item, category) && <ItemLabel>Loppuunmyyty</ItemLabel>}
        <DeleteItem onClick={(e) => handleDelete(e,item)}>-</DeleteItem>
      </ItemWrapper>)
      )}
    </ItemContainer>
  );
}

export default ItemList