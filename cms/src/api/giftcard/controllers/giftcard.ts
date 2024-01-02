/**
 *  giftcard controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::giftcard.giftcard',{
  async addGiftCard(ctx) {
    const {code, orderUid} = ctx.request.body;
    const newCard = await strapi.query('api::giftcard.giftcard').findOne({
      where: {
        code,
        item: {
          id: {
            $null: true,
          }
        }
      },
      populate: {
        itemType: true,
      }
    });
    if(!newCard) {
      return ctx.notFound('NOTFOUND');
    }
    const order = await strapi.query('api::order.order').findOne({
      where: {
        uid: orderUid,
      }
    });
    if(!order) {
      return ctx.notFound('NOTFOUND');
    }
    const itemToBeLinked = await strapi.query('api::item.item').findOne({
      where: {
        itemType:{
          id: newCard.itemType.id,
        },
        order: order.id,
        giftCard: {
          id: {
            $null: true
          }
        }
      }
    });
    console.log(order,newCard,itemToBeLinked);
    if(!itemToBeLinked) {
      return ctx.badRequest('NOMATCH');
    }
    const result = await strapi.query('api::giftcard.giftcard').update({
      where: {
        code: code
      },
      data: {
        item: {
          id: itemToBeLinked.id
        }
      }
    });
    return this.transformResponse(result);
  }
});
