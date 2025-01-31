import Form from "@/components/ContactForm";
import { fetchAPI } from "@/lib/api";
import {
  ContactForm,
  Customer,
  Item,
  Order,
  StrapiBaseType,
} from "@/utils/models";
import { getTranslation } from "@/utils/translationHelper";
import OrderList from "./OrderList";
export const dynamic = "force-dynamic";
type Global = StrapiBaseType<{
  updateEnd: string;
}>;

const getContactForms = async (locale: string) => {
  try {
    const contactForms = await fetchAPI<ContactForm[]>(
      "/contact-forms",
      { cache: "no-store" },
      {
        locale,
        populate: ["contactForm", "itemTypes"],
      },
    );
    return contactForms;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getGlobalSettings = async () => {
  try {
    return fetchAPI<Global>("/global", { cache: "no-store" });
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getCustomer = async (customerUid: string) => {
  try {
    const customer = fetchAPI<Customer>(`/customers/findByUid/${customerUid}`, {
      cache: "no-store",
    });
    return customer;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getOrders = async (customerUid: string) => {
  try {
    const orders = fetchAPI<Order[]>(
      `/orders/findByCustomerUid/${customerUid}`,
      { cache: "no-store" },
    );
    return orders;
  } catch (error) {
    console.error(error);
    return [];
  }
};

type Props = {
  params: {
    locale: string;
    customerUid: string;
  };
};

const EditPage = async ({ params: { locale, customerUid } }: Props) => {
  const [global, contactForms, customer, orders, translation] =
    await Promise.all([
      getGlobalSettings(),
      getContactForms(locale),
      getCustomer(customerUid),
      getOrders(customerUid),
      getTranslation(locale),
    ]);
  if (!customer) return <p>No customer found</p>;
  if (!global) return <p>Error in update settings</p>;
  const items = orders.reduce<Item[]>((list, order) => {
    return [...list, ...order.attributes.items.data];
  }, []);
  return (
    <div>
      <div className="container mb-32 max-w-3xl mx-auto bg-secondary-50 dark:bg-secondary-800 p-1 pt-4 sm:p-8 rounded shadow-md">
        <Form
          contactForms={contactForms}
          customer={customer}
          items={items}
          locale={locale}
        />
        <br />
      </div>
      <OrderList translation={translation} orders={orders} locale={locale} />
    </div>
  );
};

export default EditPage;
