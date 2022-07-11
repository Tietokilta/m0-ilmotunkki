import styled from "styled-components";
import { mappedItems } from "../utils/helpers";
import { Item } from "../utils/models";
import { Element } from "../styles/styles";

type PropType = {
  items: Item[];
  children?: React.ReactNode;
}

const Order: React.FC<PropType> = ({items: cartItems, children}) => {
  const items = mappedItems(cartItems);
  const totalQuantity = items.reduce((acc,item) => item.quantity + acc,0);
  const cartTotal = items.reduce((acc,item) => item.quantity*item.price + acc,0);
  return (
    <BoxWrapper>
      <Header flex={4}>{totalQuantity} {totalQuantity === 1 ? 'tuote' : 'tuotetta'}</Header>
      {items.map(item => {
        if (!item.quantity) return null;
        return (
        <Flex key={item.id}>
          <Element flex={4}>
            <Title>{item.name}</Title>
            <Subtitle>{item.quantity} kpl</Subtitle>
          </Element>
          <Price flex={2}>{(item.quantity)*item.price} €</Price>
        </Flex>
        );
      })}

      {children && <Flex>
        {children}
      </Flex>}
      <Flex>
        <Element flex={4}><b>yhteensä</b></Element>
        <Price flex={2}><b>{cartTotal} €</b></Price>
      </Flex>
  </BoxWrapper>
  )
};

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: solid 2px ${props => props.theme.primaryAccent};
  padding: 12px 8px;
  &:last-child {
    border: none;
  }
`
const Header = styled(Element)`
  font-size: 1rem;
  padding: 4px;
  padding-left: 8px;
  font-weight: bold;
  border-bottom: solid 2px ${props => props.theme.primaryAccent};
`; 

const Subtitle = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.secondaryLight};
`

const Title = styled.div`
  font-size: 1.3rem;
  margin-bottom: 2px;
`

const Price = styled(Element)`
  text-align: right;
  font-weight: bold;
`
const BoxWrapper = styled.div`
  box-shadow: 2px 2px 10px ${props => props.theme.primaryAccent};
  border-radius: 5px;
  padding: 16px;
`;

export default Order;