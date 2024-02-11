FROM mongo:6.0

# Répertoire pour stocker les données MongoDB et les scripts d'initialisation
RUN mkdir -p /data/db /docker-entrypoint-initdb.d

# Copiez votre script d'initialisation dans le conteneur
COPY scripts/init-mongo.js /docker-entrypoint-initdb.d/

# Répertoire de travail par défaut
WORKDIR /data/db

# Exposez le port MongoDB
EXPOSE 27017

# Commande par défaut pour lancer le serveur MongoDB
CMD ["mongod"]