import paytrailService from '@/utils/paytrail';

import { serverFetchAPI } from '@/lib/serverApi';
import { CallbackPageFields } from '@/utils/models';
import { updateOrderState } from '@/app/api/createPayment/route';

import Result from './Result';

type CheckoutStatus = 'new' | 'ok' | 'fail' | 'pending' | 'delayed';

const getContent = async (locale: string) => {
  try {
    const content = await serverFetchAPI<CallbackPageFields>('/callback-page',{},{
      locale: locale,
    });
    return content;
  } catch(error) {
    return undefined;
  }
}



type Props = {
  params: {
    locale: string
  },
  searchParams: Record<string, string>;
}

const CallbackPage = async ({params: {locale}, searchParams}: Props) => {
  const params = searchParams;
  const isValid = paytrailService.verifyPayment(params);
  if(isValid) {
    await updateOrderState(
      Number(params['checkout-reference']),
      params['checkout-status'] || 'fail',
      params['checkout-transaction-id'] || undefined,
      );
  }
  const paymentStatus = params['checkout-status'] as CheckoutStatus;
  const content = await getContent(locale);
  
  return <Result
            locale={locale}
            isValid={isValid}
            paymentStatus={paymentStatus}
            content={content}/>
}

export default CallbackPage