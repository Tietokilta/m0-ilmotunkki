FROM node:16 as builder

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

ENV PATH /app/node_modules/.bin:$PATH

RUN npm run build

COPY ./ .


ARG STRAPI_TOKEN
ARG NEXT_PUBLIC_STRAPI_API_URL
ENV STRAPI_TOKEN=${STRAPI_TOKEN}
ENV NEXT_PUBLIC_STRAPI_API_URL=${NEXT_PUBLIC_STRAPI_API_URL}

RUN npm run build


FROM node:16-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]