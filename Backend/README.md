# Mon Vieux Grimoire - Back-End

## Sommaire

- [Description](#description)
- [Installation et lancement](#installation-et-lancement)
- [Documentation de l'API](#documentation-de-lapi)
- [Structure du projet](#structure)
- [Auteur](#auteur)

## Description

Ce dossier contient le code source du back-end pour le projet Mon Vieux Grimoire. Il gère les opérations liées à la notation des livres et à la gestion des utilisateurs.

## Installation et lancement

1. **Installation des dépendances**

   Assurez-vous d'avoir Node.js installé. Exécutez la commande suivante pour installer les dépendances :

   ```bash
   npm install
   ```
2. **Configuration du fichier `.env`**

   Le projet utilise des variables d'environnement pour la configuration de la connexion à la base de données. Suivez les étapes suivantes pour configurer le fichier .env :
   - **Copiez le fichier exemple** : À la racine du dossier Backend, vous trouverez un fichier nommé `.env.example`. Copiez ce fichier et renommez-le en `.env`.
   - **Modifiez le fichier `.env`** : Ouvrez le fichier `.env` et remplissez les valeurs nécessaires en ajustant l'URL de la base de données MongoDB en fonction de votre configuration.
   
   
3. **Démarrage du serveur**

   Vous pouvez démarrer le serveur de deux manières :
   - Avec Node
     Exécutez la commande suivante pour démarrer le serveur :
     ```bash
     node server
     ```
   - Avec Nodemon
     Si vous préférez utiliser Nodemon pour le redémarrage automatique, exécutez :
     ```bash
     nodemon server
     ```

     <details>
         <summary>Comment installer nodemon avec npm ?</summary>
  
     - **Installation globale** : Faites la commande `npm install nodemon -g` 
     - **Installation locale** : Faites la commande `npm install nodemon --save-dev` 
     </details>
     
4. **Tester l'API**
     
     Utilisez un client comme [Postman](https://www.postman.com/) ou connectez le [front-end](https://github.com/MaelleN95/Mon-Vieux-Grimoire/tree/main/Frontend) pour tester les routes.

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
- **Validation des utilisateurs** : Les modifications d'un livre sont limitées au propriétaire du livre. En cas de non-correspondance entre l'ID de l'utilisateur et l'ID du propriétaire du livre, une réponse `403: unauthorized request` est renvoyée.
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

## Structure

- `/app.js` : Fichier principal du serveur Express
- `/controllers/` : Contient les contrôleurs pour les livres et utilisateurs
- `/models/` : Contient les modèles Mongoose pour les livres et utilisateurs
- `/routes/` : Définit les routes pour l'API
- `/middleware/` : Contient le middleware d'authentification et de gestion des fichiers

## Auteur

L'implémentation du back-end a été réalisée par [Maëlle Nioche](https://www.linkedin.com/in/maelle-nioche/).
