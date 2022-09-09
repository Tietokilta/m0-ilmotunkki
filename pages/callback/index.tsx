import type {
  NextPage,
  GetServerSideProps, 
  InferGetServerSidePropsType} from 'next'
import { useEffect, useContext, useRef } from 'react';
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
    serverFetchAPI<CallbackPageFields>('/callback-page',{},{
      locale: context.locale,
    }),
    fetchAPI<Translation>('/translation',{},{
      locale: context.locale,
      populate: ['translations']
    }),
  ]);
  const data = context.query as Record<string,number | string>;
  const isValid = paytrailService.verifyPayment(data);
  try {
    if(!isValid) throw new Error('Not valid');
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
  const {reset} = useContext(AppContext);
  const handled = useRef(false);
  useEffect(() => {
    if(isValid && paymentStatus === 'ok' && !handled.current) {
      handled.current = true;
      reset();
    }
  },[isValid, paymentStatus, reset]);
  let result = <p>{content.attributes.onSuccess}</p>
  if(isValid === undefined) return <p>Loading...</p>
  if (!isValid) result = <div>
    {content.attributes.onError} <Link href="/summary">
      <a className='text-sky-900'>{translation.backToOrder}</a>
      </Link>
    </div>
  else if (paymentStatus !== 'ok') result = <div>
    {content.attributes.onCancel} <Link href="/summary">
      <a className='text-sky-900'>{translation.backToOrder}</a>
    </Link>
  </div>
  return (
    <div className='container max-w-3xl bg-slate-50 mx-auto rounded shadow-md p-2 pt-4 sm:p-8'>
      {result}
    </div>
  );
}

export default CallbackPage