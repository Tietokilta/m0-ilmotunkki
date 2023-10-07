import Image from 'next/image';
import { redirect } from 'next/navigation';
import qs from 'qs';
import { fetchAPI } from '@/lib/api';
import { Order } from '@/utils/models';
import type { PaytrailPaymentResponse, SkipPaymentParams } from '@/utils/models';


type Props = {
  params: {
    locale: string;
    orderUid: string
  }
}

const getOrderInformation = async (orderUid: string) => {
  try {
    const order = await fetchAPI<Order>(`/orders/findByUid/${orderUid}`);
    return order;
  } catch(error) {
    console.error(error);
    return undefined;
  }
}

type PaymentApiResponse = PaytrailPaymentResponse | SkipPaymentParams;

const initializePayment = async (orderId: number) => {
  try {
    const response = await fetch('/api/createPayment', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
      })
    });
    const data = await response.json() as PaymentApiResponse;
    return data;
  } catch(error) {
    return undefined;
  }
}

const isSkipPayment = (response: PaymentApiResponse): response is SkipPaymentParams => {
  return 'status' in response && response.status === 'skip';
}

const Checkout = async ({params: {locale, orderUid}}: Props) => {
  const order = await getOrderInformation(orderUid);
  if(!order || order.attributes.status === 'ok') {
    return null;
  }
  const paymentResponse = await initializePayment(order.id);
  if(!paymentResponse) {
    return null;
  }
  if(isSkipPayment(paymentResponse)) {
    return redirect(`/${locale}/callback?${qs.stringify(paymentResponse.params)}`);
  }
  const paymentProviders = paymentResponse.providers;

  return (
    <main className='container flex flex-wrap justify-center gap-3 p-2 mx-auto max-w-3xl'>
      {paymentProviders.filter(provider => provider.group !== 'credit').map(provider =>
      <form
      className='flex justify-center items-center w-40'
       key={provider.name} method="POST" action={provider.url}>
        {provider.parameters && provider.parameters.map(parameter => 
          <input key={parameter.name} type='hidden' name={parameter.name} value={parameter.value} />
        )}
        <button className='bg-transparent border-secondary-900 dark:border-secondary-50 border rounded h-full w-full'>
          <Image height={60} width={150} src={provider.svg} alt={`${provider.name}-icon`}/>
          </button>
      </form>)}
    </main>
  );
}

export default Checkout;