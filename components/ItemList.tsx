import styled from 'styled-components';
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Item, ItemCategory, ItemType } from "../utils/models";


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
const itemCount = (items: Item[], itemSlug: string) => items.filter(
  ({
    attributes: {
      itemType: {
        data: { attributes }
      }
    }
  }) => attributes.slug === itemSlug).length;

type Props = {
  itemTypes: ItemType[],
  itemCategories: ItemCategory[],
}
const ItemList: React.FC<Props> = ({itemTypes, itemCategories}) => {
  const { order, initializeOrder, addItem, deleteItem, items } = useContext(AppContext);
  const handleClick = async (item: ItemType) => {
    let orderId = order.id
    if (!order.id) {
      const result = await initializeOrder();
      orderId = result.id
    }
    await addItem(item, orderId);
  }
  return (
    <ItemContainer>
      {itemTypes.map(item =>
      <ItemWrapper onClick={() => handleClick(item)} key={item.id}>
        <ItemLabel>
          {item.attributes.slug}
        </ItemLabel>
        <ItemPrice>{item.attributes.price} €</ItemPrice>
        <ItemCount>{itemCount(items, item.attributes.slug)} kpl</ItemCount>
        <DeleteItem onClick={(e) => {e.stopPropagation(); deleteItem(item.attributes.slug)}}>-</DeleteItem>
      </ItemWrapper>)} 
    </ItemContainer>
  );
}

export default ItemList