import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType} from 'next'
  import useSWR from 'swr';
  import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { fetchAPI } from '../../lib/api';
import { initialCustomer } from '../../context/AppContext';
import { ContactForm,Customer,Field, Order, Translation } from '../../utils/models';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { transformTranslations } from '../../utils/helpers';
import GroupComponent from '../../components/Group';
import Loader from '../../components/Loader'
import OrderComponent from '../../components/Order';


type ServerSidePropType = {
  contactForm: Field[],
  translation: Record<string, string>
}
export const getServerSideProps: GetServerSideProps<ServerSidePropType> = async (context) => {
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
  }
}

type PropType = InferGetServerSidePropsType<typeof getServerSideProps>

const Form: NextPage<PropType> = ({contactForm, translation}) => {
  const router = useRouter();
  const {orderUid} = router.query;
  const [isLoading, setLoading] = useState(false);
  const {data: customer, mutate: refreshFields} = useSWR<Customer>(`/customers/findByOrderUid/${orderUid}`, fetchAPI);
  const {data: orders, mutate: mutateOrders} = useSWR<Order[]>(customer ? `/orders/findByCustomerUid/${customer.attributes.uid}` : null, fetchAPI);
  
  const [inputFields, setInputFields] = useState<Record<string,any>>(customer?.attributes || initialCustomer);

  useEffect(() => {
    if(!customer) return;
    setInputFields(customer.attributes);
  },[customer]);

  if(!customer)return null;

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
      <form className='mb-6 bg-slate-50 rounded shadow-md p-8' 
            onSubmit={handleSubmit}>
        {contactForm.map(field => (
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
          <button disabled={isLoading} className='btn h-12'>{translation.update}</button>
        </div>
      </form>
      {orders?.map(order => <div key={order.id} className="bg-slate-50 rounded shadow-md mb-8 p-4">
        <OrderComponent
          translation={translation}
          items={order.attributes.items.data}
        />
        {order.attributes.status === 'new' &&
          <Link passHref href={`/checkout/${order.attributes.uid}`}>
          <button className='btn mt-5'
            disabled={
            order.attributes.items.data.length === 0
          }>{translation.pay}</button></Link>}
        </div>
      )}
    </div>

  );
}

export default Form;