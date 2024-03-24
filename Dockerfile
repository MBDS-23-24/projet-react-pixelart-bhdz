# Définir l'image de base
FROM node:18

# Créer le répertoire de l'application
WORKDIR /usr/src/app
COPY . .

RUN npm install


EXPOSE 8080

CMD ["npm", "run", "start:client"]
