/**
 *  item-category controller
 */

import { factories } from '@strapi/strapi'

export type ItemType = StrapiBaseType<{
  price: number;
  availableFrom: string;
  availableTo: string;
  itemCategory: StrapiResponse<ItemCategory>;
  slug: string;
}>;
export type ItemCategory = StrapiBaseType<{
  orderItemLimit: number;
  maximumItemLimit: number;
  name: string;
  itemTypes: StrapiResponse<ItemType[]>;
  currentQuantity: number;
  overflowItem: StrapiResponse<ItemType | null>;
}>;
export type StrapiBaseType<T> = {
  id: number;
  attributes: T & {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};
type StrapiResponse<T> = {
  data: T
}

export default factories.createCoreController('api::item-category.item-category', {
  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    const totalCategoryItemCount = await strapi.query('api::item.item').count({
      where: {
        itemType: {
          itemCategory: {
            id: data.id
          }
        }
      },
    });
    data.attributes.currentQuantity = totalCategoryItemCount;
    return { data, meta };
  },
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    const categories = data as ItemCategory[];
    const now = new Date();
    const filteredData = categories.reduce((acc,category) => {
      const filteredItemTypes = category.attributes.itemTypes.data.filter(itemType => {
        if(!itemType.attributes.availableFrom || !itemType.attributes.availableTo) return true;
        const availableFrom = new Date(itemType.attributes.availableFrom);
        const availableTo = new Date(itemType.attributes.availableTo);
        return now > availableFrom && now < availableTo;
      });
      category.attributes.itemTypes.data = filteredItemTypes;
      acc.push(category);
      return acc;
    },[] as ItemCategory[]);
    const mappedPromises = filteredData.map(async (newData: ItemCategory) => {
      const totalCategoryItemCount = await strapi.query('api::item.item').count({
        where: {
          itemType: {
            itemCategory: {
              id: newData.id
            }
          }
        },
      });
      return {
        id: newData.id,
        attributes: {
          ...newData.attributes,
          currentQuantity: totalCategoryItemCount,
        }
      };
    });
    const mappedData = await Promise.all(mappedPromises);
    return { data: mappedData, meta };
  }
});
