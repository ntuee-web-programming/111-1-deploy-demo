FROM node:16-alpine

ARG PORT=4000

ENV PORT=$PORT

EXPOSE ${PORT}

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install:prod
RUN yarn build

CMD ["yarn", "deploy"]
