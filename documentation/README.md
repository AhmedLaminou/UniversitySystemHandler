# Architecture SOA - Système de Gestion Universitaire

## Table des Matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Proposée](#architecture-proposée)
3. [Stratégie de Base de Données](#stratégie-de-base-de-données)
4. [Services à Développer](#services-à-développer)
5. [Sécurité](#sécurité)
6. [Déploiement](#déploiement)
7. [Guide de Développement](#guide-de-développement)

---

## Vue d'ensemble

Ce projet implémente une architecture SOA (Service-Oriented Architecture) pour la gestion d'un système universitaire, comprenant la gestion des étudiants, cours, notes et facturation.

### Objectifs du Projet
- Concevoir une architecture SOA robuste et scalable
- Développer des services web REST et SOAP hétérogènes
- Assurer l'interopérabilité entre différentes technologies
- Implémenter la sécurité et l'authentification JWT
- Déployer avec Docker et Docker Compose

---

## Architecture Proposée

### Diagramme d'Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│            (Web App, Mobile App, Third-party)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│                   (Spring Cloud Gateway)                     │
│  - Routage des requêtes                                      │
│  - Validation JWT                                            │
│  - Rate Limiting                                             │
│  - Load Balancing                                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
┌──────────────────┐ ┌─────────────┐ ┌──────────────────┐
│  Auth Service    │ │   Student   │ │   Course Service │
│  (Spring Boot)   │ │   Service   │ │   (Java/JAX-WS)  │
│  REST + JWT      │ │(Node.js/Exp)│ │      SOAP        │
│                  │ │    REST     │ │                  │
└────────┬─────────┘ └──────┬──────┘ └────────┬─────────┘
         │                  │                  │
         ▼                  ▼                  ▼
    ┌─────────┐       ┌─────────┐       ┌─────────┐
    │   DB    │       │   DB    │       │   DB    │
    │  Auth   │       │ Student │       │ Course  │
    └─────────┘       └─────────┘       └─────────┘

          ▼                ▼
┌──────────────────┐ ┌──────────────────┐
│  Grade Service   │ │ Billing Service  │
│ (Python/FastAPI) │ │   (.NET Core)    │
│      REST        │ │      SOAP        │
└────────┬─────────┘ └────────┬─────────┘
         │                    │
         ▼                    ▼
    ┌─────────┐         ┌─────────┐
    │   DB    │         │   DB    │
    │  Grade  │         │ Billing │
    └─────────┘         └─────────┘

┌─────────────────────────────────────────┐
│      Service Registry (optionnel)       │
│         (Eureka/Consul)                 │
└─────────────────────────────────────────┘
```

---

## Stratégie de Base de Données

### ⭐ Recommandation : Architecture Microservices avec Bases de Données Séparées

### Option 1 : Base de Données par Service (RECOMMANDÉ) ✅

#### Architecture
Chaque service possède sa propre base de données indépendante.

```
Service Auth      → PostgreSQL (users, roles, tokens)
Service Student   → MongoDB (students, documents)
Service Course    → MySQL (courses, schedules)
Service Grade     → PostgreSQL (grades, evaluations)
Service Billing   → SQL Server (invoices, payments)
```

#### Avantages
1. **Autonomie Complète** : Chaque équipe peut choisir la technologie de BD adaptée à ses besoins
2. **Isolation des Pannes** : Une BD en panne n'affecte pas les autres services
3. **Scalabilité Indépendante** : Possibilité de scaler uniquement les BD sous charge
4. **Déploiement Indépendant** : Pas de coordination nécessaire pour les migrations
5. **Sécurité Renforcée** : Isolation des données sensibles (notes, facturation)
6. **Alignement SOA/Microservices** : Respecte les principes d'architecture distribuée
7. **Performance Optimisée** : Chaque BD peut être optimisée pour son cas d'usage

#### Inconvénients
1. **Complexité de Gestion** : Multiplication des instances de BD à maintenir
2. **Transactions Distribuées** : Impossibilité d'utiliser des transactions ACID classiques
3. **Cohérence Éventuelle** : Nécessite des patterns comme Saga, Event Sourcing
4. **Jointures Impossibles** : Pas de jointures SQL entre services
5. **Duplication de Données** : Certaines données peuvent être répliquées
6. **Coût d'Infrastructure** : Plus de ressources nécessaires

#### Patterns à Implémenter
- **API Composition** : L'API Gateway agrège les données de plusieurs services
- **CQRS** : Séparer les opérations de lecture/écriture
- **Event-Driven** : Communication asynchrone via messages (RabbitMQ/Kafka)
- **Saga Pattern** : Gérer les transactions distribuées

---

### Option 2 : Base de Données Unique Partagée

#### Architecture
Tous les services accèdent à une seule base de données centrale.

```
                    ┌─────────────────┐
All Services ───────►  PostgreSQL DB  │
                    │  - users        │
                    │  - students     │
                    │  - courses      │
                    │  - grades       │
                    │  - billing      │
                    └─────────────────┘
```

#### Avantages
1. **Simplicité** : Une seule BD à gérer et maintenir
2. **Transactions ACID** : Transactions garanties entre tables
3. **Jointures Faciles** : Requêtes SQL complexes possibles
4. **Cohérence Forte** : Pas de problèmes de synchronisation
5. **Moins de Ressources** : Une seule instance de BD
6. **Développement Rapide** : Plus simple pour un prototype

#### Inconvénients
1. **Couplage Fort** : Les services dépendent tous du même schéma
2. **Point de Défaillance Unique** : Si la BD tombe, tout s'arrête
3. **Scalabilité Limitée** : Impossible de scaler indépendamment
4. **Conflits de Schéma** : Coordination nécessaire pour les migrations
5. **Pas SOA Pur** : Viole le principe d'indépendance des services
6. **Goulot d'étranglement** : Performance limitée par une seule BD
7. **Sécurité** : Tous les services ont accès à toutes les données

---

### 🎯 Décision Recommandée pour le Projet

**Utilisez l'Option 1 (BD par Service)** car :

1. **Respect des Exigences** : Le sujet demande une architecture SOA distribuée
2. **Apprentissage** : Vous apprendrez les vrais défis des architectures distribuées
3. **Portfolio** : Projet plus impressionnant pour votre CV
4. **Technologies Variées** : Utilisation de PostgreSQL, MongoDB, MySQL comme demandé
5. **Notation** : L'architecture distribuée valorisera votre note

### Compromis pour Simplifier (si contraintes de temps)
Vous pouvez utiliser la même technologie (ex: PostgreSQL) pour toutes les BD mais maintenir des **instances séparées** :

```yaml
# docker-compose.yml
services:
  db-auth:
    image: postgres:15
    environment:
      POSTGRES_DB: auth_db
  
  db-student:
    image: postgres:15
    environment:
      POSTGRES_DB: student_db
  
  db-course:
    image: mysql:8
    environment:
      MYSQL_DATABASE: course_db
```

---

## Services à Développer

### 1. Service d'Authentification (REST - Spring Boot)

**Port** : 8081  
**Base de Données** : PostgreSQL  
**Responsabilités** :
- Inscription et authentification des utilisateurs
- Génération et validation des tokens JWT
- Gestion des rôles (ETUDIANT, PROFESSEUR, ADMIN)

**Endpoints REST** :
```
POST   /api/auth/register          - Inscription
POST   /api/auth/login             - Connexion (retourne JWT)
POST   /api/auth/refresh           - Rafraîchir le token
GET    /api/auth/validate          - Valider un token
POST   /api/auth/logout            - Déconnexion
GET    /api/users/{id}             - Profil utilisateur
PUT    /api/users/{id}             - Modifier profil
```

**Schéma BD** :
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL
);
```

**Technologies** :
- Spring Boot 3.x
- Spring Security
- JWT (io.jsonwebtoken)
- PostgreSQL
- BCrypt pour le hashing

---

### 2. Service Étudiants (REST - Node.js/Express)

**Port** : 8082  
**Base de Données** : MongoDB  
**Responsabilités** :
- CRUD des étudiants
- Gestion des informations académiques
- Recherche et filtrage

**Endpoints REST** :
```
POST   /api/students               - Créer un étudiant
GET    /api/students               - Liste des étudiants (pagination)
GET    /api/students/{id}          - Détails d'un étudiant
PUT    /api/students/{id}          - Modifier un étudiant
DELETE /api/students/{id}          - Supprimer un étudiant
GET    /api/students/search        - Rechercher (query params)
```

**Schéma MongoDB** :
```javascript
{
  _id: ObjectId,
  studentId: String,        // ID unique
  userId: Number,           // Référence à auth service
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    zipCode: String
  },
  enrollmentDate: Date,
  major: String,
  level: String,            // L1, L2, L3
  status: String,           // ACTIVE, SUSPENDED, GRADUATED
  createdAt: Date,
  updatedAt: Date
}
```

**Technologies** :
- Node.js 18+
- Express.js
- MongoDB avec Mongoose
- JWT validation middleware

---

### 3. Service Cours (SOAP - Java/JAX-WS)

**Port** : 8083  
**Base de Données** : MySQL  
**Responsabilités** :
- Gestion du catalogue de cours
- Emplois du temps
- Inscription aux cours

**Opérations SOAP** :
```xml
- createCourse(Course): CourseResponse
- getCourse(courseId): Course
- getAllCourses(): CourseList
- updateCourse(courseId, Course): CourseResponse
- deleteCourse(courseId): StatusResponse
- enrollStudent(studentId, courseId): EnrollmentResponse
- getStudentCourses(studentId): CourseList
- getCourseSchedule(courseId): Schedule
```

**Schéma BD** :
```sql
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INT NOT NULL,
    semester INT NOT NULL,
    professor_name VARCHAR(100),
    max_students INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT REFERENCES courses(id),
    day_of_week VARCHAR(10),
    start_time TIME,
    end_time TIME,
    room VARCHAR(20)
);

CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50),
    course_id INT REFERENCES courses(id),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    UNIQUE(student_id, course_id)
);
```

**Technologies** :
- Java 17+
- JAX-WS (Jakarta XML Web Services)
- MySQL Connector
- WSDL generation

---

### 4. Service Notes (REST - Python/FastAPI)

**Port** : 8084  
**Base de Données** : PostgreSQL  
**Responsabilités** :

- Gestion des notes et évaluations
- Calcul des moyennes
- Génération de relevés de notes

**Endpoints REST** :
```
POST   /api/grades                 - Ajouter une note
GET    /api/grades/student/{id}    - Notes d'un étudiant
GET    /api/grades/course/{id}     - Notes d'un cours
PUT    /api/grades/{id}            - Modifier une note
DELETE /api/grades/{id}            - Supprimer une note
GET    /api/grades/student/{id}/average    - Moyenne générale
GET    /api/grades/student/{id}/transcript - Relevé de notes
GET    /api/grades/statistics      - Statistiques
```

**Schéma BD** :
```sql
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id INTEGER NOT NULL,
    exam_type VARCHAR(20) NOT NULL,  -- DS, EXAM, TP, PROJET
    grade DECIMAL(4,2) NOT NULL CHECK (grade >= 0 AND grade <= 20),
    coefficient DECIMAL(3,2) DEFAULT 1.0,
    exam_date DATE NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grade_averages (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    semester INTEGER NOT NULL,
    average DECIMAL(4,2),
    total_credits INTEGER,
    computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, semester)
);
```

**Technologies** :
- Python 3.11+
- FastAPI
- SQLAlchemy (ORM)
- PostgreSQL (psycopg2)
- Pydantic pour validation

---

### 5. Service Facturation (SOAP - .NET Core)

**Port** : 8085  
**Base de Données** : SQL Server (ou PostgreSQL)  
**Responsabilités** :
- Gestion des frais universitaires
- Génération de factures
- Suivi des paiements

**Opérations SOAP** :
```xml
- createInvoice(studentId, amount, description): InvoiceResponse
- getInvoice(invoiceId): Invoice
- getStudentInvoices(studentId): InvoiceList
- recordPayment(invoiceId, Payment): PaymentResponse
- getPaymentHistory(studentId): PaymentList
- getOutstandingBalance(studentId): BalanceResponse
```

**Schéma BD** :
```sql
CREATE TABLE invoices (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, PAID, OVERDUE
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20),  -- CASH, CARD, TRANSFER
    payment_date DATETIME DEFAULT GETDATE(),
    transaction_id VARCHAR(50),
    notes TEXT
);
```

**Technologies** :
- .NET 8 SDK
- ASP.NET Core
- WCF Core (CoreWCF)
- Entity Framework Core
- SQL Server ou PostgreSQL

---

### 6. API Gateway (Spring Cloud Gateway)

**Port** : 8080  
**Responsabilités** :
- Point d'entrée unique
- Routage intelligent
- Validation JWT centralisée
- Rate limiting
- Load balancing
- Agrégation de données

**Configuration de Routes** :
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/auth/**
          filters:
            - RewritePath=/api/auth/(?<segment>.*), /${segment}

        - id: student-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/students/**
          filters:
            - JwtAuthenticationFilter

        - id: course-service
          uri: http://localhost:8083
          predicates:
            - Path=/api/courses/**
          filters:
            - JwtAuthenticationFilter

        - id: grade-service
          uri: http://localhost:8084
          predicates:
            - Path=/api/grades/**
          filters:
            - JwtAuthenticationFilter

        - id: billing-service
          uri: http://localhost:8085
          predicates:
            - Path=/api/billing/**
          filters:
            - JwtAuthenticationFilter
```

**Fonctionnalités** :
- Circuit Breaker (Resilience4j)
- Request/Response logging
- CORS configuration
- Rate Limiting (Redis)

---

## Sécurité

### Authentification JWT

**Flow d'Authentification** :
```
1. Client → POST /api/auth/login (username, password)
2. Auth Service → Valide credentials
3. Auth Service → Génère JWT (Access + Refresh tokens)
4. Client → Reçoit tokens
5. Client → Appelle service avec Header: Authorization: Bearer {token}
6. API Gateway → Valide JWT
7. API Gateway → Route vers service approprié
8. Service → Traite requête (avec userId extrait du token)
```

**Structure du JWT** :
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "123",
    "username": "john.doe",
    "role": "ETUDIANT",
    "iat": 1702300000,
    "exp": 1702386400
  }
}
```

**Configuration Sécurité** :
- Access Token : 15 minutes
- Refresh Token : 7 jours
- Secret Key : Variable d'environnement
- HTTPS obligatoire en production
- Rate Limiting : 100 req/min par IP

### Règles d'Autorisation

| Endpoint | ETUDIANT | PROFESSEUR | ADMIN |
|----------|----------|------------|-------|
| GET /api/students/{self} | ✅ | ✅ | ✅ |
| GET /api/students/{other} | ❌ | ✅ | ✅ |
| POST /api/students | ❌ | ❌ | ✅ |
| PUT /api/students/{id} | ❌ | ❌ | ✅ |
| GET /api/grades/student/{self} | ✅ | ✅ | ✅ |
| POST /api/grades | ❌ | ✅ | ✅ |
| GET /api/billing/student/{self} | ✅ | ❌ | ✅ |

---

## Déploiement

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  # Bases de données
  postgres-auth:
    image: postgres:15
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: auth_user
      POSTGRES_PASSWORD: auth_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres-auth-data:/var/lib/postgresql/data

  mongodb-student:
    image: mongo:7
    environment:
      MONGO_INITDB_DATABASE: student_db
    ports:
      - "27017:27017"
    volumes:
      - mongodb-student-data:/data/db

  mysql-course:
    image: mysql:8
    environment:
      MYSQL_DATABASE: course_db
      MYSQL_USER: course_user
      MYSQL_PASSWORD: course_pass
      MYSQL_ROOT_PASSWORD: root_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql-course-data:/var/lib/mysql

  postgres-grade:
    image: postgres:15
    environment:
      POSTGRES_DB: grade_db
      POSTGRES_USER: grade_user
      POSTGRES_PASSWORD: grade_pass
    ports:
      - "5433:5432"
    volumes:
      - postgres-grade-data:/var/lib/postgresql/data

  sqlserver-billing:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      ACCEPT_EULA: Y
      SA_PASSWORD: YourStrong@Passw0rd
      MSSQL_PID: Developer
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-billing-data:/var/opt/mssql

  # Services
  auth-service:
    build: ./services/auth-service
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-auth:5432/auth_db
      SPRING_DATASOURCE_USERNAME: auth_user
      SPRING_DATASOURCE_PASSWORD: auth_pass
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres-auth

  student-service:
    build: ./services/student-service
    ports:
      - "8082:8082"
    environment:
      MONGODB_URI: mongodb://mongodb-student:27017/student_db
      JWT_SECRET: ${JWT_SECRET}
      AUTH_SERVICE_URL: http://auth-service:8081
    depends_on:
      - mongodb-student

  course-service:
    build: ./services/course-service
    ports:
      - "8083:8083"
    environment:
      MYSQL_URL: jdbc:mysql://mysql-course:3306/course_db
      MYSQL_USER: course_user
      MYSQL_PASSWORD: course_pass
    depends_on:
      - mysql-course

  grade-service:
    build: ./services/grade-service
    ports:
      - "8084:8084"
    environment:
      DATABASE_URL: postgresql://grade_user:grade_pass@postgres-grade:5432/grade_db
      AUTH_SERVICE_URL: http://auth-service:8081
    depends_on:
      - postgres-grade

  billing-service:
    build: ./services/billing-service
    ports:
      - "8085:8085"
    environment:
      ConnectionStrings__DefaultConnection: Server=sqlserver-billing;Database=billing_db;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True
    depends_on:
      - sqlserver-billing

  api-gateway:
    build: ./services/api-gateway
    ports:
      - "8080:8080"
    environment:
      AUTH_SERVICE_URL: http://auth-service:8081
      STUDENT_SERVICE_URL: http://student-service:8082
      COURSE_SERVICE_URL: http://course-service:8083
      GRADE_SERVICE_URL: http://grade-service:8084
      BILLING_SERVICE_URL: http://billing-service:8085
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - auth-service
      - student-service
      - course-service
      - grade-service
      - billing-service

volumes:
  postgres-auth-data:
  mongodb-student-data:
  mysql-course-data:
  postgres-grade-data:
  sqlserver-billing-data:
```

### Commandes de Déploiement

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f [service-name]

# Arrêter tous les services
docker-compose down

# Rebuild un service
docker-compose build [service-name]
docker-compose up -d [service-name]

# Supprimer volumes (ATTENTION: perte de données)
docker-compose down -v
```

---

## Guide de Développement

### Phase 1 : Setup Initial (Semaine 1)

**Tâches** :
1. Initialiser le repository Git
2. Créer la structure de dossiers
3. Setup Docker Compose avec toutes les BD
4. Configurer les variables d'environnement
5. Créer les Dockerfiles pour chaque service

**Répartition** :
- Étudiant 1 : Auth Service + API Gateway
- Étudiant 2 : Student Service + Grade Service
- Étudiant 3 : Course Service + Billing Service

---

### Phase 2 : Développement des Services (Semaine 2)

**Ordre de Développement Recommandé** :

1. **Auth Service** (PRIORITÉ)
   - Implémenter inscription/connexion
   - Générer JWT
   - Tester avec Postman

2. **Student Service**
   - CRUD complet
   - Intégrer validation JWT
   - Tester endpoints

3. **Course Service**
   - Implémenter SOAP operations
   - Générer WSDL
   - Tester avec SoapUI

4. **Grade Service**
   - CRUD notes
   - Calcul moyennes
   - Endpoints statistiques

5. **Billing Service**
   - SOAP operations
   - Gestion factures
   - Historique paiements

6. **API Gateway**
   - Configuration routes
   - JWT validation filter
   - Tester routing

---

### Phase 3 : Intégration et Tests (Semaine 3)

**Tests à Réaliser** :

1. **Tests Unitaires** : Chaque service individuellement
2. **Tests d'Intégration** : Communication entre services
3. **Tests de Sécurité** : JWT validation, autorisation
4. **Tests de Performance** : Load testing avec JMeter
5. **Tests E2E** : Scénarios complets utilisateur

**Scénarios de Test** :
```
Scénario 1: Inscription et Authentification
1. POST /api/auth/register
2. POST /api/auth/login → obtenir JWT
3. GET /api/auth/validate → valider token

Scénario 2: Gestion Étudiant
1. Login
2. POST /api/students → créer étudiant
3. GET /api/students/{id} → voir profil
4. PUT /api/students/{id} → modifier

Scénario 3: Inscription à un Cours
1. Login
2. GET /api/courses → lister cours
3. SOAP enrollStudent → inscription
4. GET /api/students/{id}/courses → vérifier

Scénario 4: Saisie Notes
1. Login (professeur)
2. POST /api/grades → ajouter note
3. GET /api/grades/student/{id}/average → calculer moyenne

Scénario 5: Facturation
1. Login (admin)
2. SOAP createInvoice → générer facture
3. SOAP recordPayment → enregistrer paiement
4. SOAP getOutstandingBalance → vérifier solde
```

---

### Phase 4 : Documentation et Présentation (Semaine 4)

**Documents à Produire** :

1. **Cahier des Charges** (5-8 pages)
   - Contexte et objectifs
   - Besoins fonctionnels
   - Architecture globale
   - Planning

2. **Spécifications Techniques** (10-15 pages)
   - Architecture détaillée
   - Schémas de BD
   - API documentation (REST + SOAP)
   - Diagrammes de séquence
   - Choix technologiques justifiés

3. **Manuel d'Utilisation** (8-10 pages)
   - Guide d'installation
   - Configuration
   - Endpoints et exemples
   - Troubleshooting

4. **Présentation PowerPoint** (15-20 slides)
   - Architecture
   - Démo live
   - Défis rencontrés
   - Perspectives

---

## Critères d'Évaluation

### Architecture SOA (3 points)
- ✅ Séparation claire des services
- ✅ Indépendance des services
- ✅ Communication via API Gateway
- ✅ Justification des choix architecturaux

### Services Web REST/SOAP (5 points)
- ✅ 3 services REST fonctionnels
- ✅ 2 services SOAP fonctionnels
- ✅ WSDL générés et accessibles
- ✅ Gestion des erreurs appropriée

### Interopérabilité (2 points)
- ✅ Communication entre technologies différentes
- ✅ Services hétérogènes fonctionnent ensemble
- ✅ Formats de données compatibles

### Déploiement (2 points)
- ✅ Docker Compose complet
- ✅ Tous les services démarrables
- ✅ Configuration environnement correcte

### Travail d'Équipe (2 points)
- ✅ Répartition claire des tâches
- ✅ Historique Git propre
- ✅ Collaboration effective

### Documentation (3 points)
- ✅ Documentation technique complète
- ✅ API documentation claire
- ✅ Guide d'installation fonctionnel

### Présentation (3 points)
- ✅ Présentation structurée