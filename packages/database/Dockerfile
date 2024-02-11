# Utilisez une image MongoDB officielle comme base
FROM mongo:6.0

# Créez un répertoire pour stocker les données MongoDB et les scripts d'initialisation
RUN mkdir -p /data/db /docker-entrypoint-initdb.d

# Copiez votre script d'initialisation dans le conteneur
COPY scripts/init-mongo.js /docker-entrypoint-initdb.d/

# Définissez le répertoire de travail par défaut
WORKDIR /data/db

# Exposez le port MongoDB par défaut (27017)
EXPOSE 27017

# Commande par défaut pour lancer le serveur MongoDB
CMD ["mongod"]