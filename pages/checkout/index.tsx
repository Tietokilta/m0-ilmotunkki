import Image from 'next/image';
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
    <main className='container flex flex-wrap justify-center gap-3 p-2'>
      {paymentProviders.filter(provider => provider.group !== 'credit').map(provider =>
      <form
      className='flex justify-center items-center w-40'
       key={provider.name} method="POST" action={provider.url}>
        {provider.parameters && provider.parameters.map(parameter => 
          <input key={parameter.name} type='hidden' name={parameter.name} value={parameter.value} />
        )}
        <button className='bg-transparent border-black border rounded h-full w-full'>
          <Image height={60} width={150} src={provider.svg} alt={`${provider.name}-icon`}/>
          </button>
      </form>)}
    </main>
  );
}

export default Checkout;