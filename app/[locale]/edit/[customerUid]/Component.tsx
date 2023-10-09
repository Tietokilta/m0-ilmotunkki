"use client";

import { FormEvent, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { ContactForm,Customer, Order, StrapiBaseType } from '@/utils/models';
import Link from 'next/link';
import { getContactForm } from '@/utils/helpers';
import { useTranslation } from "@/context/useTranslation";

import Loader from '@/components/Loader'
import OrderComponent from '@/components/Order';

type Global = StrapiBaseType<{
  updateEnd: string;
}>

type Props = {
  contactForms: ContactForm[];
  global: Global;
  locale: string;
  customer: Customer;
  orders: Order[];
}

const Form = ({contactForms, global, locale, orders, customer }: Props) => {
  const { translation } = useTranslation(locale);
  const [isLoading, setLoading] = useState(false);
  const updateHasEnded = new Date(global.attributes.updateEnd) <= new Date();

  const contactForm = orders ? getContactForm(contactForms, orders[0]?.attributes.items.data): undefined;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const updateFields = Object.fromEntries(form.entries());
    updateFields.locale = locale;
    delete updateFields.createdAt;
    delete updateFields.updatedAt;
    delete updateFields.publishedAt;
    try {
      await fetchAPI(`/customers/${customer.attributes.uid}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            ...updateFields,
          }
        }),
      });
    } catch(error) {
      // Error in updating the field
    }
    setLoading(false);
  };

  const getFieldValue = (key: keyof Customer["attributes"]) => {
    return customer.attributes[key] as string;
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <form className="text-secondary-800 dark:text-secondary-100 bg-secondary-50 dark:bg-secondary-800  p-1 mt-4 sm:p-8 rounded shadow-md mb-8"
            onSubmit={handleSubmit}>
        {contactForm?.map(field => (
          <div className="mb-8" key={field.fieldName}>
            <label className='block p-1'>
            {field.label}{field.required && '*'}
            <input
              className='tx-input mt-2'
              type={field.type}
              id={field.fieldName}
              name={field.fieldName}
              defaultValue={getFieldValue(field.fieldName)}
              checked={!!getFieldValue(field.fieldName)}
              required={field.required}
            />
          </label>
          </div>
        ))}
        <div className=''>
          {isLoading && <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
           <Loader/>
          </div>}
          <button disabled={isLoading || updateHasEnded} className='btn h-12'>{translation.update}</button>
        </div>
      </form>
      {orders?.map(order =>
      <div key={order.id} className="text-secondary-800 dark:text-secondary-100 bg-secondary-50 dark:bg-secondary-800  p-1 pt-4 sm:p-8 rounded shadow-md my-8">
        <OrderComponent
          locale={locale}
          items={order.attributes.items.data}
        />
        {order.attributes.status === 'admin-new' &&
          <Link passHref href={`/${locale}/checkout/${order.attributes.uid}`}>
          <button className='btn mt-5'
            disabled={
            order.attributes.items.data.length === 0
          }>{translation.pay}</button></Link>}
          <div className='mt-4 flex flex-wrap gap-4'>
            {translation.tickets}
            { order.attributes.items.data
                .sort((a,b) => a.id-b.id)
                .map(item =>
            <div
              key={item.id}
              className="p-4 w-fit"
            >
              <p className='text-center'>{translation[item.attributes.itemType.data.attributes.slug]} ID: {item.id}</p>
            </div>)}
          </div>
        </div>
      )}
    </div>

  );
}

export default Form;