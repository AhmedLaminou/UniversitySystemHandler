# 🎓 Student Service

Ce microservice gère les informations des étudiants dans l'architecture SOA de l'université. Il est construit avec **Node.js**, **Express**, et **MongoDB**.

## 🚀 Fonctionnalités

- **Gestion des étudiants** : Création, lecture, mise à jour et suppression (CRUD).
- **Recherche avancée** : Recherche textuelle par nom, email, etc.
- **Statistiques** : Répartition par filière, niveau, et statut.
- **Intégration** : Lié au service d'authentification via JWT.

## 🛠️ Technologies

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MongoDB (Mongoose)
- **Authentification** : JSON Web Tokens (JWT)

## ⚙️ Configuration

Le service est configuré via le fichier `.env`. Voici les variables d'environnement requises :

```env
PORT=8082
MONGODB_URI=mongodb://localhost:27017/student_db
JWT_SECRET=VotreSecretJWT
AUTH_SERVICE_URL=http://localhost:8081
NODE_ENV=development
```

## 📦 Installation et Démarrage

### Prérequis

- Node.js (v18+)
- MongoDB

### Étapes

1.  **Installer les dépendances** :

    ```bash
    npm install
    ```

2.  **Démarrer en mode développement** :

    ```bash
    npm run dev
    ```

3.  **Démarrer en production** :
    ```bash
    npm start
    ```

## 🐳 Docker

Pour lancer ce service avec Docker :

```bash
docker build -t student-service .
docker run -p 8082:8082 --env-file .env student-service
```

## 🔗 API Endpoints

- `GET /api/students` : Liste tous les étudiants.
- `POST /api/students` : Créer un nouvel étudiant.
- `GET /api/students/:id` : Détails d'un étudiant.
- `GET /api/students/search?query=...` : Recherche.
- `GET /api/students/statistics` : Statistiques globales.
