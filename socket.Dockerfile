FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY docker.env /app/.env
RUN yarn install

COPY . .


RUN cd packages/socket
RUN npm install

EXPOSE 3200

CMD [ "npm", "run", "start:socket" ]
