# Définir l'image de base
FROM node:14

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Installer les dépendances de l'application
# Le caractère joker est utilisé pour s'assurer que les fichiers package.json ET package-lock.json sont copiés
# où disponible (npm@5+)
COPY packages/client ./

RUN npm install
# Si tu construis ton code pour la production
# RUN npm ci --only=production

# Copier les fichiers et répertoires de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 8080

# Commande pour démarrer l'application
CMD [ "npm", "start" ]
