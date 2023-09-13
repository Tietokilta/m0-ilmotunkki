"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from "react";
import useSWR from "swr";
import GiftCardComponent from '@/components/GiftCard';
import Order from "@/components/Order";
import { AppContext } from "@/context/AppContext";
import { fetchAPI } from "@/lib/api";
import { getContactForm } from '@/utils/helpers';
import { useTranslation } from "@/context/useTranslation";
import { ContactForm, Customer, Item } from "@/utils/models";

type ContactProps = {
  customer: Customer;
  items: Item[];
  locale: string;
}

const ContactComponent = ({customer, items, locale}: ContactProps) => {
  const { translation } = useTranslation(locale);
  const { data } = useSWR<ContactForm[]>(['/contact-forms',locale], url => fetchAPI(url,{},{
    locale,
    populate: ['contactForm','itemTypes']
  }));
  const fields = data && getContactForm(data,items);

  if(!fields) return null;
  return (
    <div className='mb-5 text-primary-900 dark:text-primary-100'>
      <div className='shadow-lg rounded p-4 flex flex-col gap-2'>
        {fields.map(row =>
        <div
        className='flex flex-col sm:flex-row'
        key={row.fieldName}>
          <div className='flex-1 text-sm sm:text-base'>{row.label}</div>
          <div className='flex-1'>{
          row.type === 'checkbox' ?
          customer.attributes[row.fieldName] ? translation.yes : translation.no
          :customer.attributes[row.fieldName]
          }</div>
        </div>)}
    </div>
    </div>
  );
}

type SummaryProps = {
  locale: string
}

const Summary = ({locale}: SummaryProps) => {
  const { translation } = useTranslation(locale);
  const {customer, items, isEmpty, order} = useContext(AppContext);
  const router = useRouter();
  const [ termsAccepted, setTermsAccepted ] = useState(false);
  useEffect(() => {
    if(isEmpty) {
      router.push(`/${locale}`);
    }
  },[isEmpty, router, locale]);
  return (
    <div className='container mx-auto max-w-3xl py-4'>
      <div className='bg-secondary-50 dark:bg-secondary-800 rounded'>
        <ContactComponent items={items} customer={customer} locale={locale}/>
      </div>
      <div className='bg-secondary-50 dark:bg-secondary-800 rounded shadow-lg p-4'>
        <Order items={items} locale={locale}></Order>
      </div>
      <div className='bg-secondary-50 dark:bg-secondary-800 rounded shadow-lg p-4 text-primary-700 dark:text-primary-200'>
        <GiftCardComponent locale={locale}/>
      </div>
      <div className='my-2'>
        <label className='text-primary-700 dark:text-primary-200'>
        <input
          className='h-4 w-4 mr-3 bg-transparent'
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}/>
          {translation.haveRead} <Link href={`/${locale}/terms`} className='text-primary-900 dark:text-primary-50 underline'>
            {translation.terms}
          </Link>
        </label>
      </div>

      <div className='flex gap-2'>
      <Link passHref href={`/${locale}/contact`} className='btn'>{translation.back}</Link>
      <Link passHref href={`/${locale}/checkout/${order?.attributes.uid}`}><button className='btn' disabled={
        !termsAccepted
        || items.length === 0
        || !customer.attributes.firstName
        }>{translation.pay}</button></Link>
    </div>
    </div>
  );
}

export default Summary;