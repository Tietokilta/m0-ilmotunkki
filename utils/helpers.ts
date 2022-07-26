import { Item } from "./models";

type AggrecatedItem = {
  id: number;
  price: number;
  quantity: number;
  name: string;
};

export const mappedItems = (items: Item[]) => items.reduce((acc, item) => {
  const hasGiftCard = item.attributes.giftCard.data ? true : false;
  const itemTypeId = item.attributes.itemType.data.id
  const existingItem = acc.find(existingItem => itemTypeId === existingItem.id);
  if (!existingItem) {
    const newItem = hasGiftCard ? {
      id: itemTypeId+1000,
      price: 0,
      quantity: 1,
      name: `${item.attributes.itemType.data.attributes.slug}-0`,
      }:
      {
        id: itemTypeId,
        price: item.attributes.itemType.data.attributes.price,
        quantity: 1,
        name: item.attributes.itemType.data.attributes.slug,
      }
    return [
      ...acc,
      newItem,
    ]
  }
  existingItem.quantity += 1;
  return acc
},[] as AggrecatedItem[])