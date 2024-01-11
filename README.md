# Ilmotunkki
Web application for signups. This project uses Strapi as the CMS and Next.js as the frontend and backend service.
The Next.js requires a token from strapi in order to use its API. This means before the website can you used you need to create a token from Strapi


## Development

**These instructions are for local development.**

Go run `npm install` in `web` and `cms` folders.

Copy `.env.sample` to `.env` and fill in:
- Email settings
- CMS secrets

For generating CMS secrets you can use `npm run generate` inside `cms`-folder.

Start the project:
```
docker compose up -d
```

Import the base settings and content:
```
docker compose exec cms npx strapi import -f base_content.tar.gz
```

Go to [http://localhost:7800/cms/admin](http://localhost:7800/cms/admin), create an account and login. Go to Settings > API Tokens > Add new API Token. Name it something descriptive and set the token type to `full-access`.
Copy the new token and set it to `STRAPI_TOKEN` in `.env` file.

Then restart the web service
```
docker compose up web --force-recreate -d
```

Now the site should be up and running.


## Production

These instructions should create a working production build. You need to point a domain to the location you are setting up the application.


Go run `npm install` in `web` and `cms` folders.

Copy `.env.sample` to `.env` and fill in:
- Colors
- Paytrail
- CMS
- CMS secrets
- Email settings
- Database settings
- Cerbot settings


For generating CMS secrets you can use `npm run generate` inside `cms`-folder.

Setup the ssl certs
```
docker compose -f docker-compose.prod.yml --profile setup up --build
```

After ssl certs have been setup up run:
```
docker compose -f docker-compose.prod.yml --profile default up --build -d
```

Import the base settings and content:
```
docker compose -f docker-compose.prod.yml --profile default exec cms npx strapi import -f base_content.tar.gz
```

Go to [https://you-domain/cms/admin](https://you-domain/cms/admin), create an account and login. Go to Settings > API Tokens > Add new API Token. Name it something descriptive and set the token type to `full-access`.

Copy the new token and set it to `STRAPI_TOKEN` in `.env` file.


Then restart the web service
```
docker compose up -f docker-compose.prod.yml --profile default web --force-recreate -d
```

In order to update the application after pulling new files use
```
docker compose -f docker-compose.prod.yml --profile default up --build --force-recreate -d
```

To speed things up you can upgrade only the changed service. For example to update `web` use this:
```
docker compose -f docker-compose.prod.yml --profile default up web --no-deps --build --force-recreate -d
```