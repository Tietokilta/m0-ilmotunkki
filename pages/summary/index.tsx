import type {
  NextPage,
} from 'next'
import Link from "next/link";
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from "react";
import useSWR from "swr";
import GiftCardComponent from "../../components/GiftCard";
import Order from "../../components/Order";
import { AppContext } from "../../context/AppContext";
import { fetchAPI } from "../../lib/api";
import { ContactForm, Customer } from "../../utils/models";

const ContactComponent = ({customer}: {customer: Customer}) => {
  const {locale} = useRouter();
  const { data } = useSWR<ContactForm>(['/contact-form',locale], url => fetchAPI<ContactForm>(url,{},{
    locale,
    populate: 'contactForm',
  }));
  const fields = data?.attributes.contactForm;
  if(!fields) return null;
  return (
    <div className='mb-5'>
      <h3 className='text-lg'>Tiedot</h3>
      <div className='shadow-lg rounded p-4 flex flex-col gap-2'>
        {fields.map(row =>
        <div
        className='flex flex-col sm:flex-row'
        key={row.fieldName}>
          <div className='flex-1 text-sm sm:text-base'>{row.label}</div>
          <div className='flex-1'>{
          row.type === 'checkbox' ?
          customer.attributes[row.fieldName] ? 'Kyllä' : 'Ei'
          :customer.attributes[row.fieldName]
          }</div>
        </div>)}
    </div>
    </div>
  );
}
const Summary: NextPage = ({}) => {
  const {customer, items, isEmpty} = useContext(AppContext);
  const router = useRouter();
  const [ termsAccepted, setTermsAccepted ] = useState(false);
  useEffect(() => {
    if(isEmpty) {
      router.push('/');
    }
  },[isEmpty, router]);
  return (
    <div className='container mx-auto px-4'>
      <ContactComponent customer={customer}/>
      <div>
        <Order items={items}><GiftCardComponent/></Order>
      </div>
      <div className='my-2'>
        <label className='text-sky-700'>
        <input
          className='h-4 w-4 mr-3 bg-transparent'
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}/>
          Olen lukenut <Link href="/ehdot" passHref>
            <a className='text-sky-900 underline'>käyttöehdot</a>
          </Link>
        </label>
      </div>

      <div className='flex gap-2'>
      <Link passHref href="/contact"><a className='btn'>Takaisin</a></Link>
      <Link passHref href="/checkout"><button className='btn' disabled={
        !termsAccepted
        || items.length === 0
        || !customer.attributes.firstName
        }>Maksamaan</button></Link>
    </div>
    </div>
  );
}

export default Summary;