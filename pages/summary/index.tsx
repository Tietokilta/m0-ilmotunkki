import { ST } from "next/dist/shared/lib/utils";
import Link from "next/link";
import { useContext, useState } from "react";
import styled from "styled-components";
import GiftCardComponent from "../../components/GiftCard";
import Order from "../../components/Order";
import { AppContext } from "../../context/AppContext";
import { button, Label, Element, Checkbox } from "../../styles/styles";
import { Customer } from "../../utils/models";

const Container = styled.section`
  padding: 64px;
  max-width: ${props => props.theme.commonWidth};
  margin: auto;
`;
const ItemContainer = styled.div`
`;

const ContactComponent = ({customer}: {customer: Customer}) => {
  const data = [
    {
      label: 'Nimi',
      string: `${customer.attributes.firstName} ${customer.attributes.lastName}`,
    },
    {
      label: 'Sähköposti',
      string: customer.attributes.email,
    },
    {
      label: 'Aloitusvuosi',
      string: customer.attributes.startYear,
    },
    {
      label: 'Lisätiedot',
      string: customer.attributes.extra || '-',
    }
  ]
  return (
    <ContactWrapper>
      <h3>Tiedot</h3>
      <BoxWrapper>
        {data.map(row =>
        <Flex key={row.label}>
          <ContactLabel flex={1}>{row.label}</ContactLabel>
          <Element flex={2}>{row.string}</Element>
        </Flex>)}
    </BoxWrapper>
    </ContactWrapper>
  );
}
const ContactLabel = styled(Element)`
  @media only screen and (max-width: 768px) {
    font-size: 0.8rem;
  }
`

const BoxWrapper = styled.div`
  box-shadow: 2px 2px 10px ${props => props.theme.primaryAccent};
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ContactWrapper = styled.section`
  max-width: 450px;
  margin: 12px auto;
`
const StyledLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.secondaryDark};
`;
const Flex = styled.div`
  display: flex;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const NavigationButtons = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button`
  ${button}
`;

const Summary = () => {
  const {customer, items} = useContext(AppContext);
  const [ termsAccepted, setTermsAccepted ] = useState(false);
  return (
    <Container>
      <ContactComponent customer={customer}/>
      <ItemContainer>
        <Order items={items}><GiftCardComponent/></Order>
      </ItemContainer>
      <Label>
      <Checkbox type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)}/>
        Olen lukenut
        <Link href="/ehdot" passHref>
          <StyledLink> käyttöehdot</StyledLink>
        </Link>
      </Label>
      <br></br>
      <NavigationButtons>
      <Link passHref href="/contact"><Button>Takaisin</Button></Link>
      <Link passHref href="/checkout"><Button disabled={!termsAccepted || items.length === 0}>Maksamaan</Button></Link>
    </NavigationButtons>
    </Container>
  );
}

export default Summary;