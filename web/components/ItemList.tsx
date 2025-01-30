"use client";

import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Item, ItemCategory, ItemType } from "../utils/models";
import useSWR from "swr";
import Loader from "./Loader";
import { useTranslation } from "@/context/useTranslation";
const itemCount = (items: Item[], itemId: number) =>
  items.filter(
    ({
      attributes: {
        itemType: { data },
      },
    }) => data.id === itemId,
  ).length;

const isSoldOut = (itemType: ItemType, category: ItemCategory) => {
  if (category.attributes.overflowItem?.data?.id === itemType.id) return false;
  return (
    category.attributes.currentQuantity >= category.attributes.maximumItemLimit
  );
};
const findCategory = (itemType: ItemType, categories: ItemCategory[]) =>
  categories.find(
    (category) => itemType.attributes.itemCategory?.data?.id === category.id,
  );
type ItemPropType = {
  category: ItemCategory;
  item: ItemType;
};

const isAtLimit = (items: Item[], itemCategory: ItemCategory) => {
  const categoryItemCount =
    items?.filter(
      (item) =>
        item.attributes.itemType.data.attributes.itemCategory.data.id ===
        itemCategory.id,
    ).length || 0;
  return categoryItemCount + 1 > itemCategory.attributes.orderItemLimit;
};
type Props = {
  locale: string;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ItemList = ({ locale }: Props) => {
  const { translation } = useTranslation(locale);
  const [loading, setLoading] = useState(false);
  const { data: itemCategories, mutate: mutateCategories } = useSWR<
    ItemCategory[]
  >("/api/categories", fetcher);
  const { addItem, deleteItem, items } = useContext(AppContext);
  const handleClick = async (item: ItemType) => {
    setLoading(true);
    await addItem(item);
    await mutateCategories();
    setLoading(false);
  };
  const handleDelete = async (item: ItemType) => {
    setLoading(true);
    await deleteItem(item.id);
    await mutateCategories();
    setLoading(false);
  };
  const Item = ({ item, category }: ItemPropType) => (
    <div className="flex gap-2 text-center border-b-2 border-b-secondary-200 dark:border-b-secondary-700 mb-4 last:border-none items-center">
      <div className="flex-1 text-secondary-50 font-medium text-xl tracking-wider">
        <p>{translation[item.attributes.slug]}</p>
        <p className="text-red-500 flex-1 text-sm">
          {isSoldOut(item, category) && translation.soldOut}
        </p>
      </div>
      <p className="text-secondary-50 flex-1 font-medium text-xl">
        {item.attributes.price} €
      </p>
      <div className="flex-1 gap-4 flex items-center relative">
        <button
          onClick={() => handleDelete(item)}
          className="btn mb-4"
          disabled={itemCount(items, item.id) === 0 || loading}
        >
          -
        </button>
        <p className="text-secondary-50 mb-4 font-light text-xl">
          {itemCount(items, item.id)}
        </p>
        <button
          disabled={
            isAtLimit(items, category) || isSoldOut(item, category) || loading
          }
          onClick={() => handleClick(item)}
          className="btn mb-4"
        >
          +
        </button>
      </div>
    </div>
  );
  const mappedItems: ItemType[] = [];
  itemCategories?.map((category) =>
    category.attributes.itemTypes.data
      .filter((item) => {
        // Remove overflowItem if present
        if (category.attributes.overflowItem?.data?.id !== item.id) return true;
        // Show overlflow item only if the limit has been reached
        return (
          category.attributes.currentQuantity >=
          category.attributes.maximumItemLimit
        );
      })
      .forEach((item) => {
        item.attributes.itemCategory = {
          data: category,
        };
        mappedItems.push(item);
      }),
  );
  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
          <Loader />
        </div>
      )}
      {mappedItems
        .sort((a, b) => a.attributes.price - b.attributes.price)
        .map((item) => (
          <div key={item.id}>
            <Item item={item} category={item.attributes.itemCategory.data} />
            {item.attributes.upgradeTarget.data &&
              itemCount(items, item.id) > 0 && (
                <Item
                  key={item.attributes.upgradeTarget.data.id}
                  item={item.attributes.upgradeTarget.data}
                  category={
                    findCategory(
                      item.attributes.upgradeTarget.data,
                      itemCategories || [],
                    ) || item.attributes.itemCategory.data
                  }
                />
              )}
          </div>
        ))}
    </div>
  );
};

export default ItemList;
