# Utiliser l'image officielle de MongoDB
FROM mongo:latest

# Copier le script de configuration dans le conteneur
COPY scripts/setup-mongo.sh /docker-entrypoint-initdb.d/

COPY scripts/init-mongo.js /scripts/

# Exposer le port par défaut de MongoDB
EXPOSE 27017

# Commande pour démarrer MongoDB avec le Replica Set activé
CMD ["mongod", "--replSet", "rs0", "--bind_ip_all"]
