import type {
  NextComponentType,
} from 'next';
import styled from 'styled-components';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { fetchAPI } from '../../lib/api';
import { AppContext } from '../../context/AppContext';
import { button, Input, Label } from '../../styles/styles';
import { StrapiBaseType } from '../../utils/models';
import { useRouter } from 'next/router';
import Link from 'next/link';

type FormData = {
  attributes: {
    [key: string]: {
      type: string;
      [key: string]: string | number | boolean;
    }
  }
}
const Button = styled.button`
  ${button}
`;

type GenericHelperType = Record<string, any>

const cmsTypeToInputType = {
  string: 'text',
  text: 'text',
  integer: 'number',
  email: 'email',
} as Record<string, string>

type TranslationResponse = StrapiBaseType<{
  contactForm: Record<string,string>;
}>;
const Form: NextComponentType = () => {
  const router = useRouter();
  const {customer, refreshFields} = useContext(AppContext);
  const [formData, setForm] = useState<FormData>({attributes:{}});
  const [inputFields, setInputFields] = useState(customer.attributes);
  const fetchData = async () => {
    const response = await fetchAPI<{schema: FormData}>('/content-type-builder/content-types/api::customer.customer');
    setForm(response.schema);
  };
  useEffect(() => {
    fetchData();
  },[]);
  useEffect(() => {
    setInputFields(customer.attributes);
  },[customer])
  if(!customer.id) {
    return null;
  }
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const updateFields: GenericHelperType = {...inputFields};
    delete updateFields.createdAt;
    delete updateFields.updatedAt;
    delete updateFields.publishedAt;
    delete updateFields.orders;
    await fetchAPI(`/customers/${customer.id}`, {
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
  const handleChange = (event: ChangeEvent<HTMLInputElement>, key: string) => {
    setInputFields(previousKeys => {
      return {
        ...previousKeys,
        [key]: event.target.value,
      }
    })
  }
  if(!formData.attributes || !customer.id) return null;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData.attributes).filter(fieldKey => {
          const field = formData.attributes[fieldKey];
          switch(field.type) {
            case 'string':
            case 'integer':
            case 'email':
            case 'text':
              return true;
            default:
              return false;
          }
        }).map(fieldKey => {
          const field = formData.attributes[fieldKey];
          return (
            <Label key={fieldKey}>
              {fieldKey}
              <Input 
                type={cmsTypeToInputType[field.type]}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, fieldKey)}
                value={(inputFields as GenericHelperType)[fieldKey] || ''}
              />
            </Label>
          );
        })}
        <Button>Lähetä</Button>
      </form>
      <br></br>
      <Link href="/">
        <Button>Takaisin</Button>
      </Link>
    </div>

  );
}

export default Form;