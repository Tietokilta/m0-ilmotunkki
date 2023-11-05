import '@strapi/strapi';

export default ({strapi}: any) => ({
  async signups(ctx: any) {
    const entries = await strapi.query('api::order.order').findMany({
      populate: {
        customer: true,
        items: {
          populate: {
            itemType: true,
          }
        }
      },
    });
    if(entries.length === 0) return ctx.body = [];
    let result = '';
    const headers = [...Object.keys(entries[0].customer),'items'].join(';');
    result += `${headers}\n`;
    entries.forEach(entry => {
      const values = {
        ...entry.customer,
        items: entry.items.map(item => item.itemType.slug)
      }
      result += `${Object.values(values).join(';')}\n`
    });
    ctx.body = {result};
  },
});
