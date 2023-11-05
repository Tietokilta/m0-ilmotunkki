/**
 *  customer controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::customer.customer',{
  async create(ctx) {
    const {orders} = ctx.request.body.data;
    const result = await strapi.query('api::customer.customer').create({
      data: {
        firstName: '',
        orders,
      }
    });
    return this.transformResponse(result);
  },
  async update(ctx) {
    const {id} = ctx.request.params;
    const {data} = ctx.request.body;
    const { updateEnd= undefined } = await strapi.query('api::global.global').findOne();
    if(updateEnd && new Date(updateEnd) <= new Date()) {
      return this.transformResponse({});
    }
    const result = await strapi.query('api::customer.customer').update({
      where: {
        uid: id,
      },
      data
    });
    return this.transformResponse(result);
  },
  async findByOrderUid(ctx) {
    const {uid} = ctx.params;
    console.log(uid);
    const entity = await strapi.query('api::customer.customer').findOne({
      where: {
        orders: {
          uid,
        },
      },
    });
    return this.transformResponse(entity);
  },
  async findByUid(ctx: { params: { uid: string; }; }) {
    const { uid } = ctx.params;
    console.log(uid);
    const entity = await strapi.query('api::customer.customer').findOne({
      where: {
        uid,
      },
    });
    return this.transformResponse(entity);
  }
});
