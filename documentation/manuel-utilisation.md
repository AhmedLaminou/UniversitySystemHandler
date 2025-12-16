# Manuel d'Utilisation - Système SOA Universitaire

## Table des Matières
1. [Installation & Configuration](#1-installation--configuration)
2. [Démarrage des Services](#2-démarrage-des-services)
3. [Authentification](#3-authentification-et-jwt)
4. [Utilisation des Services](#4-utilisation-des-services)
5. [Exemples de Requêtes](#5-exemples-de-requêtes)
6. [Troubleshooting](#6-troubleshooting)
7. [Arrêt et Nettoyage](#7-arrêt-et-nettoyage)

---

## 1. Installation & Configuration

### 1.1 Prérequis
```
✓ Docker Desktop 24.0+
✓ Docker Compose 2.0+
✓ Git (pour cloner le repository)
✓ 6 GB d'espace disque minimum
✓ Ports disponibles : 3000, 8000, 8080, 8081, 8082, 9090
```

### 1.2 Structure du Projet
```
MiniProjetSOA/
├── FrontEnd/                     (React + TypeScript)
│   ├── src/
│   │   ├── pages/            (Dashboard, Grades, Billing...)
│   │   ├── components/       (UI Components)
│   │   ├── lib/api.ts        (Appels API REST/SOAP)
│   │   └── hooks/            (useAuth, etc.)
│   └── package.json
├── services/
│   ├── student-service/          (Node.js/Express)
│   ├── grade-service/            (Python/FastAPI)
│   ├── billing-service/          (Java/Spring-WS SOAP)
│   ├── auth-service/             (Java/Spring Boot)
│   ├── course-service/           (Java/Apache CXF SOAP)
│   └── mysql-init/               (Scripts SQL)
├── docker-compose.yml            (Orchestration)
├── documentation/                (Guides)
└── README.md
```

### 1.3 Variables d'Environnement
Créer un fichier `.env` à la racine du projet :

```env
# JWT Configuration
JWT_SECRET=MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters
JWT_EXPIRATION=86400

# MySQL
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=auth_db

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=pass

# PostgreSQL
POSTGRES_PASSWORD=postgres
POSTGRES_DB=grade_db

# Service Ports
AUTH_SERVICE_PORT=8080
STUDENT_SERVICE_PORT=3000
COURSE_SERVICE_PORT=8082
GRADE_SERVICE_PORT=8000
BILLING_SERVICE_PORT=8081
FRONTEND_PORT=5173
```

---

## 2. Démarrage des Services

### 2.1 Démarrage Complet

#### Option 1 : Démarrer TOUS les services
```powershell
cd C:\Users\ahmed\Documents\TP\LSI3\SOA\MiniProjetSOA

# Construire et démarrer
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

#### Option 2 : Démarrer services spécifiques
```powershell
# Démarrer seulement Student + MongoDB
docker-compose up --build student-service mongodb

# Démarrer Grade + PostgreSQL
docker-compose up --build grade-service postgres

# Démarrer Billing + MySQL
docker-compose up --build billing-service mysql
```

### 2.2 Vérifier le Status

#### Voir les conteneurs en cours d'exécution
```powershell
docker-compose ps

# Output:
# NAME                      STATUS
# miniprojetsoa-mysql-1     Up 2 minutes
# miniprojetsoa-mongodb-1   Up 2 minutes
# miniprojetsoa-postgres-1  Up 2 minutes
# miniprojetsoa-student-service-1   Up 1 minute
# miniprojetsoa-grade-service-1     Up 1 minute
# miniprojetsoa-billing-service-1   Up 1 minute
```

#### Voir les logs d'un service
```powershell
# Logs en temps réel
docker-compose logs -f student-service

# Logs du service Billing
docker-compose logs billing-service

# Derniers 100 lignes
docker-compose logs --tail=100 mysql
```

### 2.3 Health Checks

Vérifier que les services sont opérationnels :

```powershell
# Student Service
Invoke-WebRequest http://localhost:3000/health

# Grade Service
Invoke-WebRequest http://localhost:8000/health

# Billing Service
Invoke-WebRequest http://localhost:8081/api/health

# Auth Service
Invoke-WebRequest http://localhost:8080/actuator/health
```

---

## 3. Authentification et JWT

### 3.1 Flux d'Authentification

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ POST /auth/register
       │ ou POST /auth/login
       ▼
┌──────────────────────────────────┐
│      Auth Service (8080)         │
│  - Valide credentials            │
│  - Génère JWT Token              │
└──────┬───────────────────────────┘
       │
       │ JWT Token
       ▼
┌──────────────────────────────────┐
│      Client avec Token           │
│  Authorization: Bearer {token}   │
└──────┬───────────────────────────┘
       │
       │ Requête avec Token
       ▼
┌──────────────────────────────────┐
│    API Gateway / Services        │
│  - Valide le Token               │
│  - Traite la requête             │
└──────────────────────────────────┘
```

### 3.2 Obtenir un JWT Token

#### Étape 1 : Inscription (si nouveau utilisateur)
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmed@university.edu",
    "password": "SecurePass123!",
    "firstName": "Ahmed",
    "lastName": "Laminou",
    "role": "STUDENT"
  }'
```

**Réponse :**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "ahmed@university.edu",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

#### Étape 2 : Login (utilisateur existant)
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmed@university.edu",
    "password": "SecurePass123!"
  }'
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3MDI2Njc0MDB9...",
  "expiresIn": 86400,
  "refreshToken": "..."
}
```

### 3.3 Utiliser le Token

Pour chaque requête aux services, inclure le header :
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 4. Utilisation des Services

### 4.1 Service Étudiants (Port 3000)

#### Lister les étudiants
```bash
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

#### Créer un étudiant
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "matricule": "STU002",
    "firstName": "Fatima",
    "lastName": "Ben",
    "email": "fatima@university.edu",
    "program": "Génie Logiciel",
    "enrollmentDate": "2024-09-01"
  }'
```

#### Récupérer un étudiant
```bash
curl -X GET http://localhost:3000/api/students/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

#### Modifier un étudiant
```bash
curl -X PUT http://localhost:3000/api/students/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmed",
    "lastName": "Laminou",
    "email": "ahmed.laminou@university.edu"
  }'
```

#### Supprimer un étudiant
```bash
curl -X DELETE http://localhost:3000/api/students/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

---

### 4.2 Service Notes (Port 8000)

#### Lister les notes
```bash
curl -X GET http://localhost:8000/api/grades \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

#### Ajouter une note
```bash
curl -X POST http://localhost:8000/api/grades \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "550e8400-e29b-41d4-a716-446655440000",
    "course_id": "COURSE001",
    "grade": 92.5
  }'
```

#### Moyenne d'un étudiant
```bash
curl -X GET http://localhost:8000/api/grades/student/550e8400-e29b-41d4-a716-446655440000/average \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

**Réponse :**
```json
{
  "student_id": "550e8400-e29b-41d4-a716-446655440000",
  "average": 87.3,
  "total_courses": 5,
  "gpa": 3.8
}
```

---

### 4.3 Service Facturation (Port 8081 - SOAP)

#### Récupérer les factures (SOAP Request)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:bil="http://billing.nexis.com">
   <soapenv:Header>
      <Authorization>Bearer {YOUR_TOKEN}</Authorization>
   </soapenv:Header>
   <soapenv:Body>
      <bil:getInvoices>
         <studentId>550e8400-e29b-41d4-a716-446655440000</studentId>
      </bil:getInvoices>
   </soapenv:Body>
</soapenv:Envelope>
```

#### Via cURL
```bash
curl -X POST http://localhost:8081/api/services/billing \
  -H "Content-Type: text/xml" \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -d @- << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:bil="http://billing.nexis.com">
   <soapenv:Header/>
   <soapenv:Body>
      <bil:getInvoices>
         <studentId>550e8400-e29b-41d4-a716-446655440000</studentId>
      </bil:getInvoices>
   </soapenv:Body>
</soapenv:Envelope>
EOF
```

---

### 4.4 Service Cours (Port 8082 - SOAP)

#### Voir le WSDL
```
http://localhost:8082/services/course?wsdl
```

#### Requête SOAP - Lister les cours
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:cou="http://course.nexis.com">
   <soapenv:Header/>
   <soapenv:Body>
      <cou:getCourses/>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## 5. Exemples de Requêtes

### 5.1 Workflow Complet

#### 1. S'authentifier
```bash
$token = (curl -X POST http://localhost:8080/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"ahmed@university.edu","password":"SecurePass123!"}' | ConvertFrom-Json).token

Write-Output $token
```

#### 2. Créer un étudiant
```bash
curl -X POST http://localhost:3000/api/students `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d @- << 'EOF'
{
  "matricule": "STU003",
  "firstName": "Ayoub",
  "lastName": "Mouldi",
  "email": "ayoub@university.edu",
  "program": "Génie Logiciel"
}
EOF
```

#### 3. Ajouter une note
```bash
curl -X POST http://localhost:8000/api/grades `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"student_id":"STU003","course_id":"COURSE001","grade":88.5}'
```

#### 4. Récupérer la moyenne
```bash
curl -X GET http://localhost:8000/api/grades/student/STU003/average `
  -H "Authorization: Bearer $token"
```

### 5.2 Collection Postman

Importer dans Postman :

```json
{
  "info": {
    "name": "SOA University System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:8080/auth/login",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "raw": "{\"username\":\"ahmed@university.edu\",\"password\":\"SecurePass123!\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Students",
      "item": [
        {
          "name": "List All",
          "request": {
            "method": "GET",
            "url": "http://localhost:3000/api/students",
            "header": [
              {"key": "Authorization", "value": "Bearer {{token}}"}
            ]
          }
        }
      ]
    }
  ]
}
```

---

## 6. Troubleshooting

### 6.1 Service ne démarre pas

#### Problème : Port déjà utilisé
```powershell
# Voir quel processus utilise le port 3000
netstat -ano | findstr :3000

# Arrêter le processus
taskkill /PID {PID} /F

# Relancer les services
docker-compose up -d
```

#### Problème : Erreur de compilation Java
```powershell
# Nettoyer le cache Docker
docker-compose down -v
docker system prune -a

# Relancer
docker-compose up --build
```

### 6.2 Problèmes de Connectivité

#### Services ne communiquent pas
```powershell
# Vérifier le réseau Docker
docker network ls
docker network inspect miniprojetsoa_soa-network

# Redémarrer les services
docker-compose restart
```

#### Base de données non accessible
```powershell
# Vérifier les logs MySQL
docker-compose logs mysql

# Accéder directement à la base
docker-compose exec mysql mysql -uroot -proot -e "SHOW DATABASES;"
```

### 6.3 Problèmes JWT

#### Erreur "Token invalide"
- Vérifier la variable `JWT_SECRET` dans docker-compose.yml
- Vérifier que le token n'a pas expiré (24 heures)
- Générer un nouveau token avec login

#### Erreur "Unauthorized"
```bash
# Vérifier le format du token
curl -X GET http://localhost:8000/api/grades \
  -H "Authorization: Bearer {VOTRE_TOKEN_COMPLET}"

# Le token doit être complet (3 parties séparées par des points)
# Format : eyJhbGciOi...(header).eyJzdWIiOi...(payload).SflKxw...(signature)
```

### 6.4 Problèmes de Base de Données

#### Réinitialiser MongoDB
```powershell
docker-compose exec mongodb mongosh
> db.dropDatabase()
> exit
```

#### Réinitialiser PostgreSQL
```powershell
docker-compose exec postgres psql -U postgres -d grade_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

#### Réinitialiser MySQL
```powershell
docker-compose exec mysql mysql -uroot -proot -e "DROP DATABASE IF EXISTS auth_db; CREATE DATABASE auth_db;"
```

---

## 7. Arrêt et Nettoyage

### 7.1 Arrêter les Services
```powershell
# Arrêter sans supprimer les conteneurs
docker-compose stop

# Arrêter et supprimer
docker-compose down

# Arrêter et supprimer les volumes (données)
docker-compose down -v
```

### 7.2 Nettoyage Complet
```powershell
# Supprimer tous les conteneurs arrêtés
docker container prune -f

# Supprimer les images inutilisées
docker image prune -a -f

# Supprimer les volumes inutilisés
docker volume prune -f
```

### 7.3 Sauvegarde des Données
```powershell
# Sauvegarder MongoDB
docker-compose exec mongodb mongodump --out /backup

# Sauvegarder PostgreSQL
docker-compose exec postgres pg_dump -U postgres grade_db > grade_db.sql

# Sauvegarder MySQL
docker-compose exec mysql mysqldump -uroot -proot auth_db > auth_db.sql
```

---

## 8. Ressources Utiles

### 8.1 Documentation Officielle
- [Docker Compose](https://docs.docker.com/compose/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Express.js](https://expressjs.com/)
- [FastAPI](https://fastapi.tiangolo.com/)

### 8.2 Outils Recommandés
- **Postman** : Tests d'API REST
- **SoapUI** : Tests SOAP
- **MongoDB Compass** : Visualisation MongoDB
- **pgAdmin** : Gestion PostgreSQL
- **Docker Desktop** : Interface Docker

### 8.3 Fichiers Logs Importants
```
docker-compose logs student-service
docker-compose logs grade-service
docker-compose logs billing-service
docker-compose logs mysql
docker-compose logs mongodb
docker-compose logs postgres
```

---

## 9. Support et FAQ

### Q: Comment changer le port d'un service ?
**R:** Modifier `docker-compose.yml` :
```yaml
student-service:
  ports:
    - "3001:3000"  # Port externe:interne
```

### Q: Puis-je utiliser mon IDE local pour développer ?
**R:** Oui ! Les services s'exécutent dans Docker. Vous pouvez coder localement et redémarrer les conteneurs.

### Q: Comment ajouter une nouvelle variable d'environnement ?
**R:** 
1. Ajouter dans `.env`
2. Référencer dans `docker-compose.yml`
3. Redémarrer avec `docker-compose up -d`

### Q: Les données persistent-elles après arrêt ?
**R:** Oui ! Les volumes Docker (`mysql_data`, `mongodb_data`, `postgres_data`) persistent les données.

---

**Version :** 2.0  
**Dernière mise à jour :** 16 Décembre 2024  
**Contact Support :** Équipe Développement

---

## 10. Utilisation du Frontend

### 10.1 Démarrage du Frontend
```powershell
cd FrontEnd
npm install
npm run dev
```

Access: **http://localhost:5173**

### 10.2 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@university.edu | Admin123! |
| Étudiant | student@university.edu | Student123! |

### 10.3 Fonctionnalités par Rôle

**Admin :**
- Voir toutes les notes des étudiants
- Voir toutes les factures
- Gérer les cours (CRUD)
- Filtrer par étudiant

**Étudiant :**
- Voir ses propres notes
- Voir ses propres factures
- Consulter l'emploi du temps
- Voir la liste des cours

### 10.4 Pages Principales

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Landing page avec stats |
| Connexion | `/login` | Authentification |
| Dashboard | `/dashboard` | Tableau de bord |
| Notes | `/dashboard/grades` | Notes et moyennes |
| Facturation | `/dashboard/billing` | Factures et paiements |
| Cours | `/dashboard/courses` | Liste des cours |
| Profil | `/dashboard/profile` | Informations utilisateur |
