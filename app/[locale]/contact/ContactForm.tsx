"use client";

import { FormEvent, useContext, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import { AppContext } from '@/context/AppContext';
import { ContactForm, Customer} from '@/utils/models';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getContactForm } from '@/utils/helpers';
import { useTranslation } from "@/context/useTranslation";


type Props = {
  locale: string;
  contactForms: ContactForm[];
}

const Form = ({locale, contactForms}: Props) => {
  const { translation } = useTranslation(locale);
  const router = useRouter();
  const {customer, refreshFields, isEmpty, items} = useContext(AppContext);
  useEffect(() => {
    if(isEmpty) {
      router.push(`/${locale}`);
    }
  },[isEmpty, router, locale]);
  const contactForm = getContactForm(contactForms || [], items);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const updateFields = Object.fromEntries(form.entries());
    updateFields.locale = locale;
    delete updateFields.createdAt;
    delete updateFields.updatedAt;
    delete updateFields.publishedAt;
    await fetchAPI(`/customers/${customer.attributes.uid}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          ...updateFields,
        }
      }),
    });
    await refreshFields();
    router.push(`/${locale}/summary`);
  };
  const getFieldValue = (key: keyof Customer["attributes"]) => {
    return customer.attributes[key] as string;
  };
  return (
    <div className="container max-w-3xl mx-auto bg-secondary-50 dark:bg-secondary-800 rounded shadow-md p-4 mt-4 sm:p-8">
      <form className='mb-6 text-secondary-800 dark:text-secondary-100' 
            onSubmit={handleSubmit}>
        {contactForm.map(field => (
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
        <div className='float-right'>
          <button className='btn h-12'>{translation.send}</button>
        </div>
      </form>
        <div>
          <Link href={`/${locale}/`} className='btn h-12'>
            {translation.back}
          </Link>
      </div>
    </div>
  );
}

export default Form;