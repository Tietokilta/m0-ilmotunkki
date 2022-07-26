
type StrapiResponse<T> = {
  data: T
}
export type StrapiBaseType<T> = {
  id: number;
  attributes: T & {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};

export type ItemCategory = StrapiBaseType<{
  orderItemLimit: number;
  maximumItemLimit: number;
  name: string;
  itemTypes: StrapiResponse<ItemType[]>;
  currentQuantity: number;
  overflowItem: StrapiResponse<ItemType | null>;
}>;

export type ItemType = StrapiBaseType<{
  price: number;
  availableFrom: string;
  availableTo: string;
  itemCategory: StrapiResponse<ItemCategory>;
  slug: string;
}>;

export type Item = StrapiBaseType<{
  itemType: StrapiResponse<ItemType>;
  order: StrapiResponse<Order>;
  giftCard: StrapiResponse<GiftCard | null>;
}>;

export type GiftCard = StrapiBaseType<{
  code: string;
}>;

export type FrontPageFields = StrapiBaseType<{
  bodyText: string;
  title: string;
}>;

export type Field = {
  label: string,
  type: string,
  required: boolean,
  fieldName: string,
}

export type ContactForm = StrapiBaseType<{
  contactForm: Field[];
}>;

export type Order = StrapiBaseType<{
  status: 'new'| 'ok' | 'fail' | 'pending',
  transactionId?: string;
  createdAt: string;
  items: StrapiResponse<Item[]>;
  customer: StrapiResponse<Customer>;
  uid: string;
}>;

export type Customer = StrapiBaseType<{
  firstName: string,
  lastName: string;
  email: string;
  uid: string;
  [key: string]: string | number;
}>