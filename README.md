# Rendu final
- Nom du projet : Pixelart
- Participants :
  - 🔵 Hoareau Quentin (github: @quentinhoareau)
  - 🔴 Bihannic Pierre  (github: @pierrebihannic)
  - 🟢 Diallo Mamadou Mouctar  (github: @mamadou-mouctar-diallo)
  - 🟣 Vincent Yehoudi (github: @Yehoudi)

# Tâches effectuées
⚠️ Les couleurs correspondent aux participations (voir la légende en haut)

### Fonctionnalités obligatoires
#### Homepage
- Une page d'accueil publique, qui permet aux utilisateurs de se connecter ou de s'inscrire. Sur cette page, on retrouve :
  - 🔴 le nombre d'utilisateurs inscrits
  - 🔴 le nombre de PixelBoards créés.
  - 🔴 la prévisualisation des derniers PixelBoards en cours de création
  - 🔴 la prévisualisation des derniers PixelBoards terminés

#### Administrateurs
- 🔴 🟢 Créer un PixelBoard en spécifiant les propriétés dans un formulaire
- 🔴 🟢 Modifier, Supprimer un PixelBoard
- 🔴 🟢 Afficher, trier, filtrer tous les PixelBoards

#### PixelBoard
- Sur la page du PixelBoard, les propriétés sont affichées
  - 🔵 🔴 temps restant avant la fermeture
- 🟣 🔵 titre, taille, délai entre deux participations
- 🔵 possibilité ou non de dessiner par-dessus un pixel déjà dessiné
- 🔵 canvas pour dessiner sur un pixel board

#### Visiteurs (utilisateurs non inscrits)
- 🟣 s'inscrire
- 🔴 optionnel dessiner sur un PixelBoard (seuls les inscrits peuvent dessiner)

#### Utilisateurs
- 🔴 Se connecter
- 🔴 Authentification simple (Basic auth ou jwt) login / mot de passe pour accéder à l'application
- 🔵 Voir leur profil
- 🟣 modifier leurs informations
- 🔴 Modifier le thème
- Voir leurs contributions
  - 🔵 Les PixelBoards
  - 🔵 le nombre total de pixels ajoutés


### Contraintes
- 🔵 Base de données via Docker : [Lien vers la base de données](https://github.com/MBDS-23-24/projet-react-pixelart-bhdz/tree/main/packages/database)
- 🔵 🔴 🟢 🟣 Gestion de projet via Github (commits, kanban...) : [Lien vers le projet Github](https://github.com/orgs/MBDS-23-24/projects/12)
- 🔵 🔴 🟢 🟣 MonoRepo
- 🔵 🔴 🟢 🟣 React client Side et node.js Server Side
- 🔵 🔴 🟢 🟣 Responsive
- 🔵 🔴 🟢 🟣 Pas de TypeScript
- 🔵 🔴 🟢 🟣 Gestion des requêtes (erreurs, loading: spinners)
- 🔵 🔴 🟢 🟣 Une Single Page App avec un routeur
- 🔵 🔴 🟢 🟣 Validation des champs des éventuels formulaires côté client
- 🔵 🔴 🟢 🟣 Utilisation d'un linter de code (ESLint)


## Bonus
- 🔵 Déploiement en ligne sur le cloud : Azure
  - Lien Front (React) :
  - Lien Back (Express.js / NodeJS) :
  - Lien Socket (Socket.Io / NodeJS ) :
  - Lien Base de données (MongoDB) :
- 🔵 Utilisation des WebSockets pour visualiser en temps réel l'avancement du dessin


## Autres (valorisation personnelle)
- 🔵 Gestion d'un error handler côté API
- 🔵 🔴 🟢 🟣 Structure de la base de données (adaptée à la performance pour la gestion des milliers de pixels)
- 🔵 Profil public consultable par tous les utilisateurs ()
- 🔵 🔴 Gestion de droits avec une couche de vérification côté client (sécurisation des routes) et côté serveur (middleware)

# Lancer le projet en local
## Pré-requis
- Avoir installé Docker
- Avoir installé node >v18
