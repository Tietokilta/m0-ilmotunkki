import type {
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Link from "next/link";
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from "react";
import useSWR from "swr";
import Order from "../../components/Order";
import { AppContext } from "../../context/AppContext";
import { fetchAPI } from "../../lib/api";
import { getContactForm, transformTranslations } from '../../utils/helpers';
import { ContactForm, Customer, Item, Translation } from "../../utils/models";

type ContactFormTypes = {
  customer: Customer;
  translation: Record<string,string>;
  items: Item[];
}

const ContactComponent: React.FunctionComponent<ContactFormTypes> = ({customer, translation, items}) => {
  const {locale} = useRouter();
  const { data } = useSWR<ContactForm[]>(['/contact-forms',locale], url => fetchAPI(url,{},{
    locale,
    populate: ['contactForm','itemTypes']
  }));
  const fields = data && getContactForm(data,items);

  if(!fields) return null;
  console.log(customer);
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
type StaticPropType = {
  translation: Record<string, string>
}
export const getStaticProps: GetStaticProps<StaticPropType> = async (context) => {
  const [translation] = await Promise.all([
    fetchAPI<Translation>('/translation',{},{
      locale: context.locale,
      populate: ['translations']
    }),
  ]);
  return {
    props: {
      translation: transformTranslations(translation),
    },
    revalidate: 60,
  }
}

type PropType = InferGetStaticPropsType<typeof getStaticProps>
const Summary: NextPage<PropType> = ({translation}) => {
  const {customer, items, isEmpty, order} = useContext(AppContext);
  const router = useRouter();
  const [ termsAccepted, setTermsAccepted ] = useState(false);
  useEffect(() => {
    if(isEmpty) {
      router.push('/');
    }
  },[isEmpty, router]);
  return (
    <div className='container mx-auto px-4 max-w-3xl pb-4'>
      <div className='bg-secondary-50 dark:bg-secondary-800 rounded'>
        <ContactComponent items={items} customer={customer} translation={translation}/>
      </div>
      <div className='bg-secondary-50 dark:bg-secondary-800 rounded shadow-lg p-4'>
        <Order items={items} translation={translation}></Order>
      </div>
      <div className='my-2'>
        <label className='text-primary-700 dark:text-primary-200'>
        <input
          className='h-4 w-4 mr-3 bg-transparent'
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}/>
          {translation.haveRead} <Link href="/terms" passHref>
            <a className='text-primary-900 dark:text-primary-50 underline'>{translation.terms}</a>
          </Link>
        </label>
      </div>

      <div className='flex gap-2'>
      <Link passHref href="/contact"><a className='btn'>{translation.back}</a></Link>
      <Link passHref href={`/checkout/${order?.attributes.uid}`}><button className='btn' disabled={
        !termsAccepted
        || items.length === 0
        || !customer.attributes.firstName
        }>{translation.pay}</button></Link>
    </div>
    </div>
  );
}

export default Summary;