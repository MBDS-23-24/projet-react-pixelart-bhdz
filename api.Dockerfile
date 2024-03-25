FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN cd packages/api
RUN npm install
EXPOSE 5010

CMD [ "npm", "run", "start:api" ]