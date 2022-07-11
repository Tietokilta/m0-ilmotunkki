import { ChangeEvent, useState, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../context/AppContext';
import { fetchAPI } from '../lib/api';
import { Error, Input, button } from '../styles/styles';


const Button = styled.button`
  ${button};
`;

const GiftCardComponent = () => {
  const [ giftCardError, setGiftCardError ] = useState('');
  const { order, refreshFields } = useContext(AppContext);
  const [ giftCard, setGiftCard ] = useState('');
  const submitGiftcard = async () => {
    try {
      await fetchAPI('/giftcard',{
        method: 'POST',
        body: JSON.stringify({
          data: {
            code: giftCard,
            order: order.id,
          }
        }),
      })
      refreshFields();
      setGiftCardError('');
    } catch(e) {
      const error = e as any;
      const { status } = error.response.data;
      if (error.response.statusCode === 429) 
        return setGiftCardError('Liian monta yritystä peräkkäin. Odota hetki');
      switch(status){
        case 'NOMATCH':
          return setGiftCardError('Ostoskorissa ei ole yhteensopivaa lippua');
        case 'DUPLICATE':
          return setGiftCardError('Olet jo lisännyt tämän lahjakortin');
        case 'NOTFOUND':
          return setGiftCardError('Väärä lahjakortin koodi')
      }
      setGiftCardError('Tapahtui virhe');
    }
    setGiftCard('')
  }
  const handleGiftCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setGiftCard(e.target.value);
  }
  return(
    <FullWidth>
      <StyledGiftCard>
        <StyledInput
          type="text"
          name="giftCard"
          value={giftCard}
          onChange={handleGiftCardChange}
          placeholder='Lahjakorttikoodi'
        ></StyledInput>
        <GiftCardButton
          disabled={false || giftCard.length === 0}
          onClick={submitGiftcard}>
          Lisää
        </GiftCardButton>
      </StyledGiftCard>
      <Error>{giftCardError}</Error>
    </FullWidth>
  )
}

const FullWidth = styled.div`
  width: 100%;
`

const StyledGiftCard = styled.div`
  margin: 8px 0;
  display: flex;
  gap: 8px;
  width: 100%;
`;

const StyledInput = styled(Input)`
  margin: 0;
  font-size: 1.2rem;
  flex: 1;
`;


const GiftCardButton = styled(Button)`
  background-color: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.secondary};
  color: ${props => props.theme.secondary};
  @media (hover: hover) {
    &:hover:enabled {
      background-color: ${props => props.theme.primary};
    }
    &:active:enabled {
      transform: translateY(-1px);
    }
  }
  &:hover{
  }
`

export default GiftCardComponent;