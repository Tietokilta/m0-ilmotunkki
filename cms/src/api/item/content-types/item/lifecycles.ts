type Event = {
  params: any;
}

export default {
  async beforeDelete(event: Event) {
    const item = await strapi.query('api::item.item').findOne({
      where: {
        id: event.params.where.id,
      },
      populate: {
        order: true,
        itemType: {
          populate: {
            upgradeTarget: true,
          },
        },
      },
    });
    if(!item.itemType.upgradeTarget) return;
    const upgradeTargetItem = await strapi.query('api::item.item').findOne({
      where: {
        itemType: {
          id: item.itemType.upgradeTarget.id
        },
        order: {
          id: item.order.id
        },
      },
    });
    if(!upgradeTargetItem) return;
    await strapi.query('api::item.item').delete({
      where: {
        id: upgradeTargetItem.id
      }
    })
  }
}