# Ilmotunkki

Web application for signups. This project uses Strapi as the CMS and Next.js as the frontend and backend service.
The Next.js requires a token from strapi in order to use its API. This means before the website can you used you need to create a token from Strapi.

Note that you need `docker` on the target machine.

**Outdated**

## Development

**These instructions are for local development.**

Note that strapi is quite heavy inside docker, so it might be beneficial to just run the database inside docker and run next and strapi outside docker. Remember to update environment variables in this case.

Go run `npm install` in `web` and `cms` folders.

Copy `.env.sample` to `.env` and fill in:

- Email settings
- CMS secrets

For generating CMS secrets you can use `npm run generate` inside `cms`-folder. (If you don't have npm installed on target system, you can run `docker run hajoppi/ilmotunkki-generate-strapi-keys` to generate the secrets.) Copy these secrets to the env file.

Start the database:

```sh
docker compose up -d
```

Import the base settings and content in cms folder:

```sh
npx strapi import -f base_content.tar.gz
```

Go to [http://localhost:1337/admin](http://localhost:1337/admin), create an account and login. Go to Settings > API Tokens > Add new API Token. Name it something descriptive and set the token type to `full-access`.
Copy the new token and set it to `STRAPI_TOKEN` in `.env` file.

Then run

```shell
npm run develop
```
in both `web` and `cms` folders. Now the site should be up and running.

## CMS

Short instructions how the cms works.
Only fields with non-obvious meanings are listed.

## Collection types

### ContactForm

Define what fields you want to collect from the customer. Each language has their own form.

- ContactForm: Array of fields
  - Label: What is shown to user
  - Required: Is the field required
  - fieldName: The field name corresponding to the customer object. See [Customer](#customer)
  - type: Input type of the field
- itemTypes: For what items does this form apply to

### Customer

What fields can be currently collected for a customer. You should collect at least the email. In the future most of the fields should be stored into a freeform json object

- Uid: With this uid the customer can edit their details for the signup
- accept: Does the user show in the "Signups" page.

### Email

Email templates that are sent after a succesful purchase. Currently only confirmation type is implemented. You can insert values from the contactForm with `{fieldName}`. Additionally if you want to send the edit link to the user you can include `https://example.org/edit/{customerUid}` into the template to send the edit link.
Each locale has their own template, and the customer receives the email in their set language.

- type: 'confirmation'
- from: Who is the sender. Make sure that the account you use has access to the alias set here.

### Giftcard

A giftcard removes the whole value from the item it is linked to. They are single time use.

- code: Gitftcard code that gives the discount
- item: After setting the giftcard, to what item the giftcard connects to
- itemType: Which item type the giftcard applies to

### Group

Not in use. Should remove in the future

### Item

One item in an order. If a customer buys multiple, they each have one corresponding item.

- itemType
- order: To which order is the item linked to
- giftCard: Which giftcard is the item linked to if any

### ItemCategory

Categories define the inventories and limits per item type. I agree that the name is a bit misleading.

- Name: Name of the category. For example "Main event" or "Sillis"
- orderItemLimit: How many items of this category can be in a single order
- itemTypes: Which ItemTypes does this category contain
- maximumItemLimit: How many items in total are in the inventory.
- overFlowItem: What itemType is used if the user tries to add an item that has no inventory left. This could be for example a reserve spot if someone cancels their purchase.

### ItemType

The attributes of a purchassable item

- Price: The price in Euros
- availableFrom: When is this item available
- availableTo: When does the availability end
- itemCategory: To which category does this item belong to
- slug: unique identifier of the type. **Used in translations**
- upgradeTarget: If there is an additional **itemType** that can be purchased when buying this item. For example after adding the main event ticket, allow them to purchase sillis.

### Order

When a user adds an item to cart, it is already added to an order. This means the cart and a succesful order are the same differentiated only by their `status` field.

- status: The state of the order. Not completed orders are expired after some time.
  - new: All new created orders. Expires after **30 minutes**
  - admin-new: The admin can manually create orders through the CMS and the customer can pay for them in the edit view. Expires **never**.
  - pending: When the customer begins the payment process. Expires after **60 minutes**
  - fail: Customer canceled the payment: Expires after **60 minutes**
  - ok: Purhace was succesful and completed. Expires **never**
  - expired: Order was expired. It is removed after **4 days**. If the payment processor is slow to respond, this gives it time to confirm the payment.

**Each `item` and `customer` requires an `order`. If they don't have one, they are deleted**. This also means that if you need to manually delete a signup, if it sufficient to remove the order and the system will cleanup the orphan items and customers.

### User

Just strapi internals. No functionality

## Single types

Configurations and page content

### Callback page

The content shown to the user after a completed or cancelled signup. Remember to fill in the selected locales

### Front page

The front page content. Remember to fill in the required locales.

- bodyText: Main text shown in the page in **markdown**
- Header: Hero image shown throughout the site
- headerTitle
- showSignups: Enables a button to show signups to all users.

### Global

Global settings for the site.

- updateEnd: When to prevent the users from editing their details
- Sponsors: List of sponsors to show in the footer
  - Logo
  - name
  - url: Clicking the logo takes them to this url
- title: Page title
- description: Page meta description
- url: Page url, set this to you domain
- favicon

### Paytrail

NOT IN USE. Should maybe remove or integrate to payment pipeline

### Terms and Conditions

Terms and conditions of the page. **You must set these so that they correspond to your association.** Remember to set all locales

### Translation

All the other translations in the page. **Remember to include the translations for your itemType slugs.** Many of these can be left as is.
