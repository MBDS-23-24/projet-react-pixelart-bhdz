FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN cd packages/api
RUN npm install
RUN yarn workspace api build

EXPOSE 5173

CMD [ "npm", "run", "start:api" ]