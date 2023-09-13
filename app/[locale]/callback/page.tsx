import paytrailService from '@/utils/paytrail';

import { serverFetchAPI } from '@/lib/serverApi';
import { CallbackPageFields } from '@/utils/models';

import { useParams } from 'next/navigation';
import Result from './Result';

type CheckoutStatus = 'new' | 'ok' | 'fail' | 'pending' | 'delayed';

const getContent = async (locale: string) => {
  const content = await serverFetchAPI<CallbackPageFields>('/callback-page',{},{
    locale: locale,
  });
  return content;
}

type Props = {
  params: {
    locale: string
  }
}

const CallbackPage = async ({params: {locale}}: Props) => {
  const params = useParams() as Record<string,number | string>;
  const isValid = paytrailService.verifyPayment(params);
  const paymentStatus = params['checkout-status'] as CheckoutStatus;
  const content = await getContent(locale);
  
  return <Result
            locale={locale}
            isValid={isValid}
            paymentStatus={paymentStatus}
            content={content}/>
}

export default CallbackPage