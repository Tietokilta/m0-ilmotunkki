import { Item } from "./models";

type AggrecatedItem = {
  id: number;
  price: number;
  quantity: number;
  name: string;
};

export const mappedItems = (items: Item[]) => items.reduce((acc, item) => {
  const itemTypeId = item.attributes.itemType.data.id;
  const existingItem = acc.find(existingItem => itemTypeId === existingItem.id);
  if (!existingItem) {
    return [
      ...acc,
      {
        id: itemTypeId,
        price: item.attributes.itemType.data.attributes.price,
        quantity: 1,
        name: item.attributes.itemType.data.attributes.slug,
      }
    ]
  }
  existingItem.quantity += 1;
  return acc
},[] as AggrecatedItem[])