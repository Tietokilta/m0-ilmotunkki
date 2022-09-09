import Image from 'next/image';
import {useRouter} from 'next/router';
import { useEffect, useState, useCallback, useRef } from 'react';
import qs from 'qs';
import { fetchAPI } from '../../lib/api';
import useSWR from 'swr';
import { Order } from '../../utils/models';

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
  const handled = useRef(false);
  const [paymentProviders, setProviders] = useState<PaymentProvider[]>([]);
  const router = useRouter();
  const {orderUid} = router.query;
  const {data: order, error} = useSWR<Order>(orderUid ? `/orders/findByUid/${orderUid}` : null, fetchAPI);
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
      router.push(`/callback?${qs.stringify(data.params)}`);
    }
    setProviders(data.providers || []);
  },[router]);

  useEffect(() => {
    if (!order || handled.current) return;
    if(order.attributes.status === 'ok') return;
    handled.current = true;
    initializePayment(order.id);
  },[order, initializePayment]);

  return (
    <main className='container flex flex-wrap justify-center gap-3 p-2 mx-auto max-w-3xl'>
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