
# Rendu final 
- Nom du projet : Pixelart
- Participants : 
  - 🔵 Hoareau Quentin (github: @quentinhoareau)
  - 🔴 Bihannic Pierre  (github: @pierrebihannic)
  - 🟢 Diallo Mamadou Mouctar  (github: @mamadou-mouctar-diallo)
  - 🟣 Vincent Yehoudi (github: @Yehoudi)

# Tâches effectuées 
⚠️ Les couleurs correpsondent aux participations (voir la légendes en haut)

### Fonctionalités obligatoire 
#### Homepage
- Une page d'accueil publique, qui permet aux utilisateurs de se connecter ou de s'inscrire. Sur cette page on retrouve :
  - 🔴 le nombre d'utilisateur inscrits 
  - 🔴 le nombre de PixelBoard créés. 
  - 🔴 la prévisualisation des dernières PixelBoard en cours de création 
  - 🔴 la prévisualisation des dernières PixelBoard terminés 

#### Administrateurs
- 🔴 🟢 Créer un PixelBoard en spécifiant les propriétés dans un formulaire 
- 🔴 🟢 Modifier, Supprimer un PixelBoard 
- 🔴 🟢 Afficher, trier, filtrer tous les PixelBoards 

#### PixelBoard
- Sur la page du PixelBoard les propriétés sont affichées 
  - 🔵 🔴 temps restant avant fermeture 
- 🟣 🔵 titre, taille, délai entre deux participations 
- 🔵 possibilité ou pas de dessiner par dessus un pixel déjà dessiné 
- 🔵 canvas pour dessiner sur un pixel board 

#### Visiteurs (utilisateurs non inscrits) 
- 🟣 s'inscrire 
- 🔴 optionnel dessiner sur un PixelBoard (seuls inscrits peuvent dessiner) 

#### Utilisateurs
- 🔴 Se connecter 
- 🔴 Authentification simple (Basic auth ou jwt) login / mot de passe pour accéder à l'application 
- 🔵 Voir leur profil
- 🟣 modifier leurs informations 
- 🔴 Modifier le thème 
- Voir leurs contributions 
  - 🔵 Les PixelBoard 
  - 🔵 le nombre total de pixel ajoutés 


### Contraintes 
- 🔵 Base de donné via Docker : https://github.com/MBDS-23-24/projet-react-pixelart-bhdz/tree/main/packages/database 
- 🔵 🔴 🟢 🟣 Gestion de projet via Github (commits,kanban...) : https://github.com/orgs/MBDS-23-24/projects/12 
- 🔵 🔴 🟢 🟣 MonoRepo 
- 🔵 🔴 🟢 🟣 React client Side et node.js Server Side 
- 🔵 🔴 🟢 🟣 Responsive 
- 🔵 🔴 🟢 🟣 Pas de typescript 
- 🔵 🔴 🟢 🟣 Gestion des requêtes (erreurs, loading: spinners) 
- 🔵 🔴 🟢 🟣 Une Single Page App avec un routeur 
- 🔵 🔴 🟢 🟣 Validation des champs des éventuels formulaires côté client 
- 🔵 🔴 🟢 🟣 Utilisation d'un linter de code (ESLint) 


## Bonus 
- 🔵 Déploiement en ligne sur le cloud : Azure 
  - Lien Front (React) :
  - Lien Back (Express.js / NodeJS) :
  - Lien Socket (Socket.Io / NodeJS ) :
- 🔵 Utilisation des WebSockets pour visualiser en temps réel l'avancement du dessin 


## Autres (valorisation personelle)
- 🔵 Gestion d'un error handler côté API 
- 🔵 🔴 🟢 🟣 Structure de la base de donné (adapaté à la performance pour la gestions des milliers pixels) 
- 🔵 Profie public consultable par tous les utilisateurs ()
- 🔵 🔴 Gestions de droits avec une couche dévrification côté client (sécurisation des routes) et côté serveur (middleware) 

# Lancer le projet en local
## Pré-requis 
- Avoir installé Docker
- Avoir installé node >v18



