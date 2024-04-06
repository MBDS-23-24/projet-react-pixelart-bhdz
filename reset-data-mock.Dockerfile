FROM node:18-alpine

COPY config.js /data/
COPY package.json /data/
COPY .env /data/
WORKDIR /data
RUN npm install

RUN mkdir -p /data/packages/database
COPY ./packages/database /data/packages/database/


WORKDIR /data/packages/database
RUN npm install

CMD ["node", "scripts/reset-data-mock-mongo.js"]
