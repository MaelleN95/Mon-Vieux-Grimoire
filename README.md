# Mon Vieux Grimoire

## Sommaire

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Documentation de l'API](#documentation-de-lapi)
  - [Authentification](#authentification)
  - [Gestion des livres](#gestion-des-livres)
  - [Sécurité et Autorisation](#sécurité-et-autorisation)
  - [Modèles de Données](#modèles-de-données)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Note de synthèse](#note-de-synthèse)
  - [Spécifications fonctionnelles](#spécifications-fonctionnelles)
  - [Spécifications techniques](#spécifications-techniques)
- [Auteur](#auteur)


## Description

Ce projet consiste à développer le back-end d'un site de notation de livres nommé Mon Vieux Grimoire. Le site permettra aux membres d'ajouter des livres, de les noter, et de voir les évaluations publiques. Le serveur est construit avec **Express** et **MongoDB**, en utilisant **Mongoose** pour la gestion des données. Le projet suit une **architecture MVC** (Modèle-Vue-Contrôleur) et intègre des pratiques de **Green Code** pour optimiser les performances et réduire l'empreinte écologique.

Il est à noter que la partie front-end a été réalisée par l'organisme de formation, dans le cadre d'un scénario de collaboration. Mon rôle s'est concentré exclusivement sur le développement du back-end, sans intervention aux aspects visuels ou à la structure du front-end.

Ce projet fait partie de ma formation sur OpenClassrooms pour le parcours [Développeur Web](https://openclassrooms.com/fr/paths/899-developpeur-web).

## Fonctionnalités

- Gestion des utilisateurs avec **authentification sécurisée** (JWT)
- **Opérations CRUD** sur les livres (Create, Read, Update, Delete)
- Système de notation de livres par les utilisateurs
- **Gestion du téléchargement** et de **l'optimisation** des images des couvertures avec **Multer** et **Sharp**
- Respect des bonnes pratiques du **Green Code** (optimisation des images)

## Installation

1. Clonez le repository :
   ```bash
   git https://github.com/MaelleN95/Mon-Vieux-Grimoire.git
2. Installez les dépendances du back-end :
   ```bash
   cd Backend
   npm install
3. Configurez la base de données MongoDB :
   - En vous basant sur le fichier `.env.example`, créez un fichier `.env` à la racine du projet contenant les variables d'environnement pour la connexion à MongoDB.
4. Démarrez le serveur back-end :
    - Avec node :

   ```bash
   node server
   ```

    - Avec nodemon :

   ```bash
   nodemon server
   ```
<details>
  <summary>Comment installer nodemon avec npm ?</summary>
  
  - **Installation globale** : Faites la commande `npm install nodemon -g` 
  - **Installation locale** : Faites la commande `npm install nodemon --save-dev` 
</details>

5. Utilisez un client comme Postman ou connectez le front-end pour tester les routes.

## Utilisation

1. Pour tester l'API, vous pouvez utiliser des outils comme Postman ou brancher le front-end.
2. Inscrivez-vous ou connectez-vous via les endpoints `/api/auth/signup` et `/api/auth/login`.
3. Une fois connecté, vous pourrez :
    - Ajouter, supprimer et modifier des livres.
    - Noter des livres et voir la note moyenne mise à jour dynamiquement.
    - Explorer et filtrer les livres par genre.

## Documentation de l'API

Cette section présente les spécifications de l'API mise en place pour la gestion des livres et des utilisateurs. L'API est conçue pour interagir avec le front-end de manière fluide et sécurisée, tout en respectant les meilleures pratiques de développement.

### Authentification

| Méthode | Point d'accès       | Corps de la requête                  | Type de réponse attendu              | Fonction                                                                                     |
|---------|---------------------|-------------------------------------|--------------------------------------|----------------------------------------------------------------------------------------------|
| POST    | `/api/auth/signup`  | `{ email: string, password: string }` | `{ message: string }`                | Hachage du mot de passe de l'utilisateur et ajout de l'utilisateur à la base de données.     |
| POST    | `/api/auth/login`   | `{ email: string, password: string }` | `{ userId: string, token: string }`  | Vérification des informations d'identification, retour de l'ID utilisateur et d'un token JWT. |

### Gestion des livres

| Méthode | Point d'accès            | Corps de la requête                           | Type de réponse attendu   | Authentification  | Fonction                                                                                           |
|---------|--------------------------|----------------------------------------------|---------------------------|-------------------|----------------------------------------------------------------------------------------------------|
| GET     | `/api/books`             | Non requis                                   | Array of books            | Non requis        | Renvoi d'un tableau de tous les livres présents dans la base de données.                         |
| GET     | `/api/books/:id`         | Non requis                                   | Single book               | Non requis        | Renvoi du livre correspondant à l'ID fourni.                                                      |
| GET     | `/api/books/bestrating`  | Non requis                                   | Array of books            | Non requis        | Renvoi des 3 livres ayant la meilleure note moyenne.                                              |
| POST    | `/api/books`             | `{ book: string, image: file }`              | `{ message: String }`     | Requis            | Capture de l'image, analyse du livre, enregistrement dans la base de données avec ImageUrl.       |
| PUT     | `/api/books/:id`         | EITHER `{ book: string, image: file }` OR `Book as JSON` | `{ message: string }`    | Requis            | Mise à jour du livre avec l'ID fourni, avec option de mise à jour de l'image ou des informations.  |
| DELETE  | `/api/books/:id`         | Non requis                                   | `{ message: string }`     | Requis            | Suppression du livre et de son image associée.                                                     |
| POST    | `/api/books/:id/rating`  | `{ userId: String, rating: Number }`         | Single book               | Requis            | Attribution d'une note au livre, mise à jour de la note moyenne et du tableau des évaluations.     |

### Sécurité et Autorisation

- **Hachage des mots de passe** : Tous les mots de passe des utilisateurs sont hachés pour assurer leur sécurité.
- **Authentification renforcée** : L'accès aux routes de gestion des livres nécessite une authentification via un token JWT dans l'en-tête d'autorisation (« Bearer »).
- **Validation des utilisateurs** : Les modifications d'un livre sont limitées au propriétaire du livre. En cas de non-correspondance entre l'ID de l'utilisateur et l'ID du livre, une réponse `403: unauthorized request` est renvoyée.
- **Unicité des adresses électroniques** : Les adresses électroniques sont uniques dans la base de données, avec des mécanismes Mongoose pour garantir cette unicité et signaler les erreurs.

### Modèles de Données

#### User

- `email` : Adresse e-mail de l’utilisateur (unique)
- `password` : Mot de passe haché de l’utilisateur

#### Book

- `userId` : Identifiant MongoDB unique de l'utilisateur qui a créé le livre
- `title` : Titre du livre
- `author` : Auteur du livre
- `imageUrl` : URL de l'image de couverture du livre
- `year` : Année de publication
- `genre` : Genre du livre
- `ratings` : Tableau des évaluations (comprend `userId`, `grade` et `averageRating`)

## Structure du projet

- `Backend/app.js` : Fichier principal du serveur Express
- `Backend/controllers/` : Contient les contrôleurs pour les livres et utilisateurs
- `Backend/models/` : Contient les modèles Mongoose pour les livres et utilisateurs
- `Backend/routes/` : Définit les routes pour l'API
- `Backend/middleware/` : Contient le middleware d'authentification et de gestion des fichiers

## Technologies utilisées

- **Node.js**
- **Express**
- **MongoDB** + **Mongoose**
- **bcrypt** pour le hachage des mots de passe
- **JSON Web Tokens** (JWT) pour l'authentification
- **Multer** et **Sharp** pour la gestion et l'optimisation des images

## Note de synthèse

### Spécifications fonctionnelles

| Fonctionnalités         | Description                                                                                                      |
|-------------------------|------------------------------------------------------------------------------------------------------------------|
| **CRUD sur les livres** | - Les utilisateurs peuvent créer, lire, mettre à jour et supprimer des livres via l'API.                         |
| **Notation des livres**| - Les utilisateurs peuvent noter les livres et la note moyenne est automatiquement calculée et affichée.          |
| **Images optimisées**  | - Les images téléchargées par les utilisateurs sont compressées pour réduire leur taille et respecter le Green Code. |

### Spécifications techniques

| Critères techniques    | Détails                                                                                                              |
|------------------------|----------------------------------------------------------------------------------------------------------------------|
| **API RESTful**        | - API structurée avec des routes sécurisées pour les opérations CRUD sur les livres et les utilisateurs.             |
| **Base de données MongoDB** | - Utilisation de Mongoose pour la gestion des schémas de livres et d'utilisateurs dans MongoDB.                 |
| **Sécurité**            | - Les mots de passe des utilisateurs sont hachés avec **bcrypt**.                                                       |
| **Authentification**    | - Utilisation de **JWT** pour sécuriser l'accès aux fonctionnalités d'ajout, modification et suppression des livres.    |
| **Gestion des images**  | - Les images des couvertures de livressont téléchargées et optimisées à l'aide de **Multer** et **Sharp**.         |

## Auteur

- [Maëlle Nioche](https://www.linkedin.com/in/maelle-nioche/)
