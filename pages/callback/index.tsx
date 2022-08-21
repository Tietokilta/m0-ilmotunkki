import type {
  NextPage,
  GetServerSideProps, 
  InferGetServerSidePropsType} from 'next'
import { useEffect, useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '../../context/AppContext';
import paytrailService from '../../utils/paytrail';
import { updateOrderState } from '../api/createPayment';
import { serverFetchAPI } from '../../lib/serverApi';
import { CallbackPageFields, Translation } from '../../utils/models';
import { fetchAPI } from '../../lib/api';
import { transformTranslations } from '../../utils/helpers';


type CheckoutStatus = 'new' | 'ok' | 'fail' | 'pending' | 'delayed';

type ServerPropsType = {
  isValid: boolean;
  paymentStatus: CheckoutStatus;
  translation: Record<string,string>;
  content: CallbackPageFields;
}

export const getServerSideProps: GetServerSideProps<ServerPropsType> = async (context) => {
  const [content, translation] = await Promise.all([
    serverFetchAPI<CallbackPageFields>('/callback-page'),
    fetchAPI<Translation>('/translation',{},{
      locale: context.locale,
      populate: ['translations']
    }),
  ]);
  const data = context.query as Record<string,number | string>;
  const isValid = paytrailService.verifyPayment(data);
  console.log({isValid});
  try {
    await updateOrderState(
      data['checkout-reference'] as number,
      data['checkout-status'] as string,
      data['checkout-transaction-id'] as string,
    );
  } catch(error) {
    console.error(error);
    return {
      props: {
        isValid: false,
        paymentStatus: 'fail',
        content,
        translation: transformTranslations(translation),
      }
    }
  }
  return {
    props: {
      isValid,
      paymentStatus: data['checkout-status'] as CheckoutStatus,
      content,
      translation: transformTranslations(translation),
    },
  }
}

type PropType = InferGetServerSidePropsType<typeof getServerSideProps>


const CallbackPage: NextPage<PropType> = ({isValid, paymentStatus, content, translation}) => {
  const {refreshFields} = useContext(AppContext);

  useEffect(() => {
    if(isValid && paymentStatus === 'ok') {
      sessionStorage.removeItem('orderUid');
      refreshFields();
    }
  },[isValid, paymentStatus, refreshFields]);
  console.log(isValid, paymentStatus);
  if(isValid === undefined) return <p>Loading...</p>
  if (!isValid) return <div>
    {content.attributes.onError}
    <Link href="/summary"><a>{translation.backToOrder}</a></Link>
    </div>
    if (paymentStatus !== 'ok') return <div>
      {content.attributes.onCancel}
      <Link href="/summary"><a>{translation.backToOrder}</a></Link>
    </div>
  return (
    <div className='container'>
      {content.attributes.onSuccess}
    </div>
  );
}

export default CallbackPage