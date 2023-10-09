"use client";

import { FormEvent } from 'react';
import { fetchAPI } from '@/lib/api';
import { ContactForm, Customer, Item} from '@/utils/models';
import { getContactForm } from '@/utils/helpers';
import { useTranslation } from "@/context/useTranslation";


type Props = {
  locale: string;
  contactForms: ContactForm[];
  customer: Customer;
  items: Item[]
}

const Form = ({locale, contactForms, customer, items}: Props) => {
  const { translation } = useTranslation(locale);
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
  };
  const getFieldValue = (key: keyof Customer["attributes"]) => {
    return customer.attributes[key] as string;
  };
  return (
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
  );
}

export default Form;