import { fetchAPI } from "@/lib/api";
import Component from "./Component";
import { ContactForm, Customer, Order, StrapiBaseType } from "@/utils/models";

type Global = StrapiBaseType<{
  updateEnd: string;
}>


const getContactForms = async (locale: string) => {
  try {
    const contactForms = await fetchAPI<ContactForm[]>('/contact-forms',{},{
      locale,
      populate: ['contactForm','itemTypes']
    });
    return contactForms;
  } catch(error) {
    console.error(error);
    return [];
  }
};

const getGlobalSettings = async () => {
  try {
    return fetchAPI<Global>('/global');
  } catch(error) {
    console.error(error);
    return undefined;
  }
};

const getCustomer = async (customerUid: string) => {
  try {
    const customer = fetchAPI<Customer>(`/customers/findByUid/${customerUid}`);
    return customer;
  } catch(error) {
    console.error(error);
    return undefined;
  }
};

const getOrders = async (customerUid: string) => {
  try {
    const orders = fetchAPI<Order[]>(`/orders/findByCustomerUid/${customerUid}`)
    return orders;
  } catch(error) {
    console.error(error);
    return [];
  }
}

type Props = {
  params: {
    locale: string;
    customerUid: string;
  }
}

const EditPage = async ({params: {locale, customerUid}}: Props) => {
  const [
    global,
    contactForms,
    customer,
    orders,
  ] = await Promise.all([
    getGlobalSettings(),
    getContactForms(locale),
    getCustomer(customerUid),
    getOrders(customerUid),
  ]);
  if (!customer) return <p>No customer found</p>
  if (!global) return <p>Error in update settings</p>
  return <Component
    customer={customer}
    orders={orders}
    contactForms={contactForms}
    global={global}
    locale={locale}
    />
}

export default EditPage;