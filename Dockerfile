FROM node:16-alpine

EXPOSE ${PORT}

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install:prod
RUN yarn build

CMD ["yarn", "deploy"]
