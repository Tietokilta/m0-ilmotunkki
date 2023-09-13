"use client";

import useSWR from 'swr';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { initialCustomer } from '@/context/AppContext';
import { ContactForm,Customer, Order, StrapiBaseType } from '@/utils/models';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getContactForm, useTranslation } from '@/utils/helpers';
import GroupComponent from '@/components/Group';
import Loader from '@/components/Loader'
import OrderComponent from '@/components/Order';

type Global = StrapiBaseType<{
  updateEnd: string;
}>

type Props = {
  contactForms: ContactForm[];
  global: Global;
  locale: string
}

const Form = ({contactForms, global, locale}: Props) => {
  const { translation } = useTranslation(locale);
  const router = useRouter();
  const {orderUid} = router.query;
  const [isLoading, setLoading] = useState(false);
  const {data: customer, mutate: refreshFields} = useSWR<Customer>(`/customers/findByOrderUid/${orderUid}`, fetchAPI);
  const {data: orders, mutate: mutateOrders} = useSWR<Order[]>(customer ? `/orders/findByCustomerUid/${customer.attributes.uid}` : null, fetchAPI);
  const [inputFields, setInputFields] = useState<Record<string,any>>(customer?.attributes || initialCustomer);
  const updateHasEnded = new Date(global.attributes.updateEnd) <= new Date();
  useEffect(() => {
    if(!customer) return;
    setInputFields(customer.attributes);
  },[customer]);

  if(!customer)return null;
  const contactForm = orders ? getContactForm(contactForms, orders[0]?.attributes.items.data): undefined;
  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const updateFields: any = {...inputFields};
    updateFields.locale = router.locale;
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

    }
    refreshFields();
    setLoading(false);
  };

  const handleChange = (event: Pick<ChangeEvent<HTMLInputElement>,'target'>, key: string, type: string) => {
    const value = type === 'checkbox' ? event.target.checked : event.target.value;
    setInputFields(previousKeys => {
      return {
        ...previousKeys,
        [key]: value,
      }
    })
  }
  return (
    <div className="container max-w-3xl mx-auto">
      <form className="text-secondary-800 dark:text-secondary-100 bg-secondary-50 dark:bg-secondary-800  p-1 mt-4 sm:p-8 rounded shadow-md mb-8"
            onSubmit={handleSubmit}>
        {contactForm?.map(field => (
          <div className="mb-8" key={field.fieldName}>
            <label className='block p-1'>
            {field.label}{field.required && '*'}
            {field.fieldName === 'group-TODO-not-implemented-in-strapi' ? 
            <GroupComponent onChange={
              (event: Pick<ChangeEvent<HTMLInputElement>,'target'>) => 
                handleChange(event, field.fieldName, field.type)}/> :
            <input
              className='tx-input mt-2'
              type={field.type}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, field.fieldName, field.type)}
              value={inputFields[field.fieldName] || ''}
              checked={inputFields[field.fieldName] || false}
              required={field.required}
            />}
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
          <Link passHref href={`/checkout/${order.attributes.uid}`}>
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