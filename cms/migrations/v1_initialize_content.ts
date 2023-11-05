export default async () => {
  const frontPageFi = await strapi.entityService.create('api::front-page.front-page', {
    data: {
      title: 'Etusivu',
      bodyText: 'Suomenkielistä tekstiä Suomenkielistä tekstiä Suomenkielistä tekstiä Suomenkielistä.',
      locale: 'fi',
    },
  });
  const frontPageEn = await strapi.entityService.create('api::front-page.front-page', {
    data: {
      title: 'Front page',
      bodyText: 'English text English text English text English text English text English text',
      locale: 'en'
    }
  });

  const contactFormFi = await strapi.entityService.create('api::contact-form.contact-form', {
    data: {
      contactForm: [
        {
          label: 'Etunimi',
          required: true,
          type: 'text',
          fieldName: 'firstName',
        },
        {
          label: 'Sukunimi',
          required: true,
          type: 'text',
          fieldName: 'lastName',
        },
        {
          label: 'Sähköposti',
          required: true,
          type: 'email',
          fieldName: 'email',
        }
      ],
      locale: 'fi'
    },
  });
  const contactFormEn = await strapi.entityService.create('api::contact-form.contact-form', {
    data: {
      contactForm: [
        {
          label: 'First name',
          required: true,
          type: 'text',
          fieldName: 'firstName',
        },
        {
          label: 'Last name',
          required: true,
          type: 'text',
          fieldName: 'lastName',
        },
        {
          label: 'Email',
          required: true,
          type: 'email',
          fieldName: 'email',
        }
      ],
      locale: 'en',
      localizations: [contactFormFi.id]
    },
  });
  await strapi.query('api::contact-form.contact-form').update({
    where: {
      id: contactFormFi.id
    },
    data: {
      localizations: [contactFormEn.id],
    },
    populate: ['localizations'],
  });

  const confirmationEmailFi = await strapi.entityService.create('api::email.email', {
    data: {
      subject: 'Etusivu',
      text: 'Hei, hyvin ilmoittauduttu',
      type: 'confirmation',
      from: 'admin@example.org',
      locale: 'fi',
    },
  });
  const confirmationEmailEn = await strapi.entityService.create('api::email.email', {
    data: {
      subject: 'Front page',
      text: 'Hi, well done because you signed up',
      type: 'confirmation',
      from: 'admin@example.org',
      locale: 'en',
      localizations: [confirmationEmailFi.id]
    },
  });
  await strapi.query('api::email.email').update({
    where: {
      id: confirmationEmailFi.id
    },
    data: {
      localizations: [confirmationEmailEn.id],
    },
    populate: ['localizations'],
  });

  const itemType1 = await strapi.entityService.create('api::item-type.item-type', {
    data: {
      price: 100,
      slug: 'vieras',
    },
  });
  const itemType2 = await strapi.entityService.create('api::item-type.item-type', {
    data: {
      price: 100,
      slug: 'kutsuvieras',
    },
  });
  const itemType3 = await strapi.entityService.create('api::item-type.item-type', {
    data: {
      price: 0,
      slug: 'varasija',
    },
  });
  const itemType4 = await strapi.entityService.create('api::item-type.item-type', {
    data: {
      price: 25,
      slug: 'sillis',
    },
  });
  const itemCategoryNormal = await strapi.entityService.create('api::item-category.item-category', {
    data: {
      name: 'normal',
      orderItemLimit: 1,
      maximumItemLimit: 100,
      itemTypes: [itemType1.id, itemType2.id],
      overflowItem: itemType3.id
    },
  });

  const itemCategoryExtra = await strapi.entityService.create('api::item-category.item-category', {
    data: {
      name: 'extra',
      orderItemLimit: 1,
      maximumItemLimit: 100,
      itemTypes: [itemType4.id],
    },
  });
}