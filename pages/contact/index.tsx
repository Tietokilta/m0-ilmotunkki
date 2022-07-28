import type {
  NextPage,
  GetStaticProps, 
  InferGetStaticPropsType} from 'next'
import styled from 'styled-components';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { fetchAPI } from '../../lib/api';
import { AppContext } from '../../context/AppContext';
import { button, Input, Label } from '../../styles/styles';
import { ContactForm,Field } from '../../utils/models';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Button = styled.button`
  ${button}
`;

export const getStaticProps: GetStaticProps<{contactForm: Field[]}> = async (context) => {
  const formData = await fetchAPI<ContactForm>('/contact-form',{},{
    locale: context.locale,
    populate: 'contactForm',
  });
  return {
    props: {
      contactForm: formData.attributes.contactForm
    },
    revalidate: 60,
  }
}

type PropType = InferGetStaticPropsType<typeof getStaticProps>

const Form: NextPage<PropType> = ({contactForm}) => {
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
    console.log(value);
    setInputFields(previousKeys => {
      return {
        ...previousKeys,
        [key]: value,
      }
    })
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {contactForm.map(field => (
          <Label key={field.fieldName}>
          {field.label}
          <Input 
            type={field.type}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, field.fieldName, field.type)}
            value={inputFields[field.fieldName] || ''}
            checked={inputFields[field.fieldName] || false}
            required={field.required}
          />
        </Label>
        ))}
        <Button>Lähetä</Button>
      </form>
      <Link href="/">
        <Button>Takaisin</Button>
      </Link>
    </div>

  );
}

export default Form;