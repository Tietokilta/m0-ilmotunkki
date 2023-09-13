import { ContactForm, Field, Item, Translation } from "./models";


type AggrecatedItem = {
  id: number;
  price: number;
  quantity: number;
  name: string;
};

export const mappedItems = (items: Item[], translation: Record<string,string>) => items.reduce((acc, item) => {
  const hasGiftCard = item.attributes.giftCard.data ? true : false;
  const itemTypeId = item.attributes.itemType.data.id
  const existingItem = acc.find(existingItem => itemTypeId === existingItem.id);
  if (!existingItem) {
    const newItem = hasGiftCard ? {
      id: itemTypeId+1000,
      price: 0,
      quantity: 1,
      name: `${translation[item.attributes.itemType.data.attributes.slug]}-0`,
      }:
      {
        id: itemTypeId,
        price: item.attributes.itemType.data.attributes.price,
        quantity: 1,
        name: translation[item.attributes.itemType.data.attributes.slug],
      }
    return [
      ...acc,
      newItem,
    ]
  }
  existingItem.quantity += 1;
  return acc
},[] as AggrecatedItem[])

export const transformTranslations = (t: Translation): Record<string,string> => 
  t.attributes.translations.reduce((acc, row) =>{
      const {key, value} = row;
      acc[key] = value;
      return acc;
    }, {} as Record<string,string>);

export const getContactForm = (forms: ContactForm[], items: Item[]): Field[] => {
  const fields: Field[] = forms.reduce((acc, form) => {
    const include = form.attributes.itemTypes.data.some(itemType => {
      return items.some(item => item.attributes.itemType.data.id === itemType.id);
    });
    if(!include) return acc
    const newFields = form.attributes.contactForm.filter(field =>
      !acc.some(existingField => existingField.fieldName === field.fieldName));
    return [...acc, ...newFields]
  },[] as Field[])

  return fields;
}