FROM node:18-alpine

WORKDIR /app

COPY config.js /app/
COPY package.json /app/
COPY docker.env /app/.env
WORKDIR /app
RUN npm install

RUN mkdir -p /app/packages/client
COPY ./packages/client /app/packages/client/


WORKDIR /app/packages/client
RUN npm install

EXPOSE 5173

WORKDIR /app/
CMD [ "npm", "run", "start:client" ]