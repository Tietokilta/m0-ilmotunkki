import styled from 'styled-components';
import {useRouter} from 'next/router';
import { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../../context/AppContext';
import qs from 'qs';

interface PaymentProvider {
  id: string;
  name: string;
  icon: string;
  svg: string;
  group: string;
  url: string;
  parameters: {
    name: string,
    value: string
  }[];
}

const Provider = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  @media only screen and (max-width: 1000px) {
    width: 150px;
  }
`
const ProviderButton = styled.button`
  background: transparent;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

const ProviderImage = styled.img`
  height: 100%;
  width: 100%;
`

const ProviderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding: 64px;
`;

const Checkout = () => {
  const {order} = useContext(AppContext);
  const [paymentProviders, setProviders] = useState<PaymentProvider[]>([]);
  const [skipParams, setSkipParams] = useState<Record<string,string>>({});
  const router = useRouter();

  const initializePayment = useCallback(async (orderId: number) => {
    const response = await fetch('/api/createPayment', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
      })
    });
    const data = await response.json();
    if(data.status === 'skip') {
      return setSkipParams(data.params);
    }
    setProviders(data.providers);
  },[]);

  useEffect(() => {
    if (!order) return;
    initializePayment(order.id);
  },[order, initializePayment]);

  useEffect(() => {
    if (order && skipParams['checkout-reference']===String(order.id)) {
      router.push(`/callback?${qs.stringify(skipParams)}`);
    }
  },[order,skipParams,router])

  return (
    <ProviderWrapper>
      {paymentProviders.filter(provider => provider.group !== 'credit').map(provider =>
      <Provider key={provider.name} method="POST" action={provider.url}>
        {provider.parameters && provider.parameters.map(parameter => 
          <input key={parameter.name} type='hidden' name={parameter.name} value={parameter.value} />
        )}
        <ProviderButton><ProviderImage src={provider.svg} alt={`${provider.name}-icon`}/></ProviderButton>
      </Provider>)}
    </ProviderWrapper>
  );
}

export default Checkout;