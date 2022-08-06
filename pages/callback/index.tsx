import type {
  NextPage,
  GetServerSideProps, 
  InferGetServerSidePropsType} from 'next'
import { useEffect, useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '../../context/AppContext';
import paytrailService from '../../utils/paytrail';
import { updateOrderState } from '../api/createPayment';


type CheckoutStatus = 'new' | 'ok' | 'fail' | 'pending' | 'delayed';

export const getServerSideProps: GetServerSideProps<{isValid: boolean, paymentStatus: CheckoutStatus}> = async (context) => {
  const data = context.query as Record<string,number | string>;
  const isValid = paytrailService.verifyPayment(data);
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
      }
    }
  }
  return {
    props: {
      isValid,
      paymentStatus: data['checkout-status'] as CheckoutStatus,
    },
  }
}

type PropType = InferGetServerSidePropsType<typeof getServerSideProps>


const CallbackPage: NextPage<PropType> = ({isValid, paymentStatus}) => {
  const {refreshFields} = useContext(AppContext);

  useEffect(() => {
    if(isValid && paymentStatus === 'ok') {
      sessionStorage.removeItem('orderUid');
      refreshFields();
    }
  },[isValid, paymentStatus, refreshFields]);
  if(isValid === undefined) return <p>Loading...</p>
  if (!isValid) return <div>
    Maksun käsittelyssä tapahtui virhe
    <Link href="/summary"><a>Takaisn tilaukseen</a></Link>
    </div>
  if (paymentStatus !== 'ok') return <div>Maksu keskeytyi</div>
  return (
    <div className='container'>
      <h1>Maksu onnistui</h1>
    </div>
  );
}

export default CallbackPage