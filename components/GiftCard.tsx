import { ChangeEvent, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { fetchAPI, StrapiError } from '../lib/api';

type PropType = {
  translation: Record<string,string>
}

const GiftCardComponent = ({translation}: PropType) => {
  const [ giftCardError, setGiftCardError ] = useState('');
  const { order, refreshFields } = useContext(AppContext);
  const [ giftCard, setGiftCard ] = useState('');
  const submitGiftcard = async () => {
    if(!order) return;
    try {
      await fetchAPI('/giftcards/addGiftCard',{
        method: 'POST',
        body: JSON.stringify({
          code: giftCard,
          orderUid: order.attributes.uid,
        }),
      });
      refreshFields();
      setGiftCardError('');
    } catch(e) {
      const error = e as StrapiError;
      const {message} = error;
      if (error.status === 429) 
        return setGiftCardError('Liian monta yritystä peräkkäin. Odota hetki');
      switch(message){
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
    <div className='w-full'>
      <div className='mt-2 flex gap-2 w-full'>
        <input
          className='tx-input'
          type="text"
          name="giftCard"
          value={giftCard}
          onChange={handleGiftCardChange}
          placeholder={translation.code}
        />
        <button
          className='btn'
          disabled={false || giftCard.length === 0}
          onClick={submitGiftcard}>
          {translation.add}
        </button>
      </div>
      <p className='text-danger-400'>{giftCardError}</p>
    </div>
  )
}

export default GiftCardComponent;