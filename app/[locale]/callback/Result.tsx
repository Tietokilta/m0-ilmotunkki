"use client";

import { useContext, useEffect, useRef } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";
import { useTranslation } from "@/utils/helpers";

type Props = {
  locale: string;
  isValid: boolean;
  paymentStatus: string;
  content: any;
}

const CallbackResult = ({ locale, isValid, paymentStatus, content}: Props) => {
  const {reset} = useContext(AppContext);
  const {translation} = useTranslation(locale);
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
    {content.attributes.onError} <Link className='text-primary-900 dark:text-primary-100 underline' href="/summary">
      {translation.backToOrder}
      </Link>
    </div>
  else if (paymentStatus !== 'ok') result = <div>
    {content.attributes.onCancel} <Link href="/summary">
      <a className='text-primary-900 dark:text-primary-100 underline'>{translation.backToOrder}</a>
    </Link>
  </div>
  return (
    <div className='container text-primary-900 dark:text-primary-100 max-w-3xl bg-secondary-50 dark:bg-secondary-800 mx-auto rounded shadow-md p-2 pt-4 sm:p-8'>
      {result}
    </div>
  );
}

export default CallbackResult;