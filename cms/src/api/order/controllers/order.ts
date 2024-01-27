/**
 *  order controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', {
  async findByUid(ctx) {
    const {uid} = ctx.params;
    const entity = await strapi.query('api::order.order').findOne({
      where: {
        uid,
      },
      populate: {
        customer: true,
        items: {
          populate: {
            itemType: {
              populate: {
                itemCategory: true,
              }
            },
            giftCard: true,
          }
        },
      }
    });
    return this.transformResponse(entity);
  },
  async findByCustomerUid(ctx) {
    const {uid} = ctx.params;
    const entity = await strapi.query('api::order.order').findMany({
      where: {
        customer: {
          uid
        },
      },
      populate: {
        items: {
          populate: {
            itemType: true,
            giftCard: true,
          }
        },
      }
    });
    return this.transformResponse(entity);
  },
  async signups(ctx) {
    const entries = await strapi.query('api::order.order').findMany({
      where: {
        items:{
          itemType: {
            itemCategory: {
              name: 'normal'
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      },
      populate: {
        customer: true,
      },
    });
    const mappedEntries = entries.map((order: any, index: number) => {
      if(!order || !order.customer) return null;
      const { accept = undefined } = order.customer
      return {
        id: order.customer.id,
        status: order.status,
        index,
        name: accept ? `${order.customer.firstName} ${order.customer.lastName}` : '-',
        group: accept ? order.customer.group : '-',
      }
    }).filter(Boolean);
    return this.transformResponse(mappedEntries);
  },
  async update(ctx) {
    const { id } = ctx.request.params;
    const entity = await strapi.query('api::order.order').findOne({
      where: {
        id,
      },
    });
    // Prevent API calls from changing the status of an order after it is set as OK
    if(entity && entity.status === 'ok') {
      ctx.request.body.data.status = 'ok';
    }
    const info = {...ctx.request.body,...ctx.request.params}
    strapi.log.info(`Order updated with information ${JSON.stringify(info)}`);
    const { data, meta } = await super.update(ctx);
    return { data, meta };
  }
});
