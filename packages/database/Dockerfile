# Utiliser l'image officielle de MongoDB
FROM mongo:latest

# Créez le répertoire d'initialisation s'il n'existe pas
RUN mkdir -p /docker-entrypoint-initdb.d/

COPY scripts/init-mongo.js /scripts/

# Créez un script shell adapter pour initialiser le Replica Set et init la structure de mongodb
RUN echo '#!/bin/bash' > /docker-entrypoint-initdb.d/init-script.sh && \
    echo 'mongosh --eval '\''rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'\''' >> /docker-entrypoint-initdb.d/init-script.sh && \
    echo 'mongosh /scripts/init-mongo.js' >> /docker-entrypoint-initdb.d/init-script.sh

# Donnez la permission d'exécution au script
RUN chmod +x /docker-entrypoint-initdb.d/init-script.sh

# Exposer le port par défaut de MongoDB
EXPOSE 27017

# Commande pour démarrer MongoDB avec le Replica Set activé
CMD ["mongod", "--replSet", "rs0", "--bind_ip_all"]
