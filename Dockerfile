# Utilisez une image MongoDB officielle comme base
FROM mongo:latest

# Créez un répertoire pour stocker les données MongoDB
RUN mkdir -p /data/db

# Définissez le répertoire de travail par défaut
WORKDIR /data/db

# Exposez le port MongoDB par défaut (27017)
EXPOSE 27017

# Commande par défaut pour lancer le serveur MongoDB
CMD ["mongod"]