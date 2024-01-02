# Ilmotunkki
Web application for signups


## Production
Copy `.env.sample` to `.env` and fill in the correct variables. Look into the `web` and `cms` folders for more instructions.

For generating Strapi secrets you can use `npm run generate` inside `cms`-folder

Setup the ssl certs
```
docker compose -f docker-compose.prod.yml --profile setup up --build
```

After ssl certs have been setup up run:
```
docker compose -f docker-compose.prod.yml --profile default up --build -d
```

In order to update the application after pulling new files use
```
docker compose -f docker-compose.prod.yml --profile default up --build --force-recreate -d
```

To speed things up you can upgrade only the changed service. For example to update `web` use this:
```
docker compose -f docker-compose.prod.yml --profile default up web --no-deps --build --force-recreate -d
```