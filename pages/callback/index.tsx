import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';


type CheckoutStatus = 'new' | 'ok' | 'fail' | 'pending' | 'delayed';

const CallbackPage = () => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<CheckoutStatus>('pending')
  const [isValid, setValid] = useState<boolean | undefined>(undefined);
  const parsed = router.query;
  const verifySkipPayment = useCallback(async () => {
    const response = await fetch(`/api/verifySkip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId: parsed['checkout-reference'] })
    });
    if(!response.ok) return setValid(false);
    setValid(true);
    setPaymentStatus('ok');
  },[parsed])

  const verifyPayment = useCallback(async () => {
    const response = await fetch(`/api/verifyPayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: parsed }),
    });
    if(!response.ok) return setValid(false);
    setValid(true);
    setPaymentStatus(parsed['checkout-status'] as CheckoutStatus)
  },[parsed]);

  useEffect(() =>{
    if(!parsed['checkout-status']) return;
    if (parsed['checkout-status'] === 'skip') {
      verifySkipPayment();
      return;
    }
    verifyPayment();
  },[parsed,router, verifyPayment, verifySkipPayment]);
  if (!isValid) return <div>Maksun käsittelyssä tapahtui virhe</div>
  if (paymentStatus !== 'ok') return <div>Maksu keskeytyi</div>
  return (
    <Wrapper>
      <h1>Onnistuit Jee</h1>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  
`


export default CallbackPage