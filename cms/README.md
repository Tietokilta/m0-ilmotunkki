# Ilmotunkki CMS

This is the CMS service of the ilmotunkki

## Development
Install dependencies

`npm install`

Install plugin dependencies

`cd src/plugins/management && npm install`

Build the admin panel plugin

`cd src/plugins/management && npm run build`

Build the admin panel (in the project root)

`npm install`

Set the required environment variables in `.env`. You can copy `.env.example` and set the variables. Most can be left as is, but APP_KEYS, SECRETS most should be set to some base64 value. Look into [https://docs.strapi.io/dev-docs/configurations/server](https://docs.strapi.io/dev-docs/configurations/server) for more information.

For the email service to work, the cms defaults to using GMAIL. Set your email and google app password to their respective fields. I do not recommend using your plain normal password for this.

Import base fields and content
`npx strapi import -f <export_file_here>.tar.gz` and use the included export The export should not contain any confidential information, but does have remnants of older projects.

Start local Postgres instance.
`docker compose up -d`

Start development mode

`npm run develop`

Create an API token for the next.js service in settings and copy that value to the next.js envs.

## Deployment

Build the dockerfile with the following envs set: `URL=<cms url of path>, NODE_ENV=<production | development>`

When running the image, make use to set the environment variables, similar to development mode, but make sure the values are secret!