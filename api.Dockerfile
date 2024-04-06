FROM node:18-alpine

WORKDIR /app

COPY config.js /app/
COPY package.json /app/
COPY docker.env /app/.env
WORKDIR /app
RUN npm install

RUN mkdir -p /app/packages/api
COPY ./packages/api /app/packages/api/


WORKDIR /app/packages/api
RUN npm install

EXPOSE 5010

WORKDIR /app/
CMD [ "npm", "run", "start:api" ]
