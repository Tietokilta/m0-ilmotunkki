import type {
  NextPage,
  GetStaticProps, 
  InferGetStaticPropsType} from 'next'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { fetchAPI } from '../../lib/api';
import { AppContext } from '../../context/AppContext';
import { ContactForm,Field, Translation } from '../../utils/models';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { transformTranslations } from '../../utils/helpers';


type StaticPropType = {
  contactForm: Field[],
  translation: Record<string, string>
}
export const getStaticProps: GetStaticProps<StaticPropType> = async (context) => {
  const [formData, translation] = await Promise.all([
    fetchAPI<ContactForm>('/contact-form',{},{
      locale: context.locale,
      populate: 'contactForm',
    }),
    fetchAPI<Translation>('/translation',{},{
      locale: context.locale,
      populate: ['translations']
    }),
  ]);
  return {
    props: {
      contactForm: formData.attributes.contactForm,
      translation: transformTranslations(translation),
    },
    revalidate: 60,
  }
}

type PropType = InferGetStaticPropsType<typeof getStaticProps>

const Form: NextPage<PropType> = ({contactForm, translation}) => {
  const router = useRouter();
  const {customer, refreshFields, isEmpty} = useContext(AppContext);
  const [inputFields, setInputFields] = useState<Record<string,any>>(customer.attributes);
  useEffect(() => {
    setInputFields(customer.attributes);
  },[customer]);
  useEffect(() => {
    if(isEmpty) {
      router.push('/');
    }
  },[isEmpty, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const updateFields: any = {...inputFields};
    updateFields.locale = router.locale;
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
    router.push('/summary');
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>, key: string, type: string) => {
    const value = type === 'checkbox' ? event.target.checked : event.target.value;
    setInputFields(previousKeys => {
      return {
        ...previousKeys,
        [key]: value,
      }
    })
  }
  return (
    <div className="container max-w-3xl mx-auto bg-slate-50 rounded shadow-md p-8">
      <form className='mb-6' 
            onSubmit={handleSubmit}>
        {contactForm.map(field => (
          <div className="mb-8" key={field.fieldName}>
            <label className='block p-1'>
            {field.label}{field.required && '*'}
            <input
              className='tx-input mt-2'
              type={field.type}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, field.fieldName, field.type)}
              value={inputFields[field.fieldName] || ''}
              checked={inputFields[field.fieldName] || false}
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
          <Link href="/">
            <button className='btn h-12'>{translation.back}</button>
          </Link>
      </div>

    </div>

  );
}

export default Form;