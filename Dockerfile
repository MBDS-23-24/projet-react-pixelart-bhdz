FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN cd packages/client
RUN npm install
RUN yarn workspace client build

EXPOSE 5173

CMD [ "npm", "run", "start:client" ]