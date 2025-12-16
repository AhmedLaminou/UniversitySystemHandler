# Cahier des Charges - Système de Gestion Universitaire SOA

## 1. CONTEXTE ET OBJECTIFS

### 1.1 Contexte Général
Ce projet vise à développer une **architecture Service-Oriented Architecture (SOA)** pour un système de gestion universitaire. Le système doit permettre la gestion centralisée des étudiants, des cours, des notes et de la facturation dans une université.

**Matière :** Architecture SOA et Services Web  
**Enseignante Responsable :** Ghada Feki  
**Enseignantes de TP :** Amel Mdimagh et Dorra Kechrid  
**Auditoire :** 3ème année Licence Génie Logiciel et Système d'Information  
**Nombre d'étudiants par équipe :** 1-3 étudiants  
**Date d'évaluation :** Semaine du 15/12/2024

### 1.2 Objectifs Généraux
- Concevoir une architecture SOA scalable et interopérable
- Développer des services web RESTful et SOAP indépendants
- Implémenter la sécurité avec authentification JWT
- Déployer les services via Docker et conteneurisation
- Documenter complètement le système et l'architecture
- Démontrer la collaboration en équipe et la gestion de projet

### 1.3 Objectifs Techniques
- ✅ Concevoir une architecture SOA (3 points)
- ✅ Développer des services web RESTful et SOAP (5 points)
- ✅ Implémenter la sécurité des services (bonus)
- ✅ Gérer l'interopérabilité entre systèmes (2 points)
- ✅ Déployer et conteneuriser des services (2 points)

### 1.4 Objectifs Méthodologiques
- ✅ Travail en équipe avec répartition des rôles (2 points)
- ✅ Gestion de projet agile (bonus)
- ✅ Documentation technique (3 points)
- ✅ Présentation orale et réponse aux questions (3 points)

---

## 2. DESCRIPTION FONCTIONNELLE

### 2.1 Services à Développer

#### **Service Authentification (Auth Service)**
- **Type :** REST API
- **Technologie :** Spring Boot 3.2
- **Port :** 8080
- **Base de données :** MySQL
- **Responsabilités :**
  - Authentification des utilisateurs
  - Génération de tokens JWT
  - Validation des credentials
  - Gestion des sessions utilisateur
- **Endpoints principaux :**
  - `POST /auth/login` - Authentification
  - `POST /auth/register` - Inscription
  - `POST /auth/validate` - Validation de token
  - `POST /auth/refresh` - Rafraîchissement de token

#### **Service Étudiants (Student Service)**
- **Type :** REST API
- **Technologie :** Node.js/Express
- **Port :** 3000
- **Base de données :** MongoDB
- **Responsabilités :**
  - Gestion CRUD des étudiants
  - Profil étudiant complet
  - Inscription aux cours
  - Historique académique
- **Endpoints principaux :**
  - `GET /students` - Lister tous les étudiants
  - `GET /students/:id` - Récupérer un étudiant
  - `POST /students` - Créer un étudiant
  - `PUT /students/:id` - Modifier un étudiant
  - `DELETE /students/:id` - Supprimer un étudiant

#### **Service Cours (Course Service)**
- **Type :** SOAP Web Service
- **Technologie :** Java/JAX-WS (Apache CXF)
- **Port :** 8082
- **Base de données :** MySQL
- **Responsabilités :**
  - Gestion des cours et modules
  - Emplois du temps
  - Enseignants et classes
  - Prérequis et validations
- **Opérations SOAP principales :**
  - `getCourses()` - Lister les cours
  - `getCourseById(id)` - Détail d'un cours
  - `createCourse(courseData)` - Créer un cours
  - `updateCourse(id, courseData)` - Modifier un cours
  - `deleteCourse(id)` - Supprimer un cours

#### **Service Notes (Grade Service)**
- **Type :** REST API
- **Technologie :** Python/FastAPI
- **Port :** 8000
- **Base de données :** PostgreSQL
- **Responsabilités :**
  - Gestion des notes et évaluations
  - Calcul des moyennes
  - Bulletins de notes
  - Statistiques académiques
- **Endpoints principaux :**
  - `GET /grades` - Lister les notes
  - `GET /grades/student/:studentId` - Notes d'un étudiant
  - `POST /grades` - Ajouter une note
  - `PUT /grades/:id` - Modifier une note
  - `DELETE /grades/:id` - Supprimer une note
  - `GET /grades/average/:studentId` - Moyenne étudiant

#### **Service Facturation (Billing Service)**
- **Type :** SOAP Web Service
- **Technologie :** Java/Spring Boot avec JAX-WS
- **Port :** 8081
- **Base de données :** MySQL
- **Responsabilités :**
  - Gestion des frais universitaires
  - Factures et paiements
  - Historique financier
  - Calcul des frais
- **Opérations SOAP principales :**
  - `getInvoices(studentId)` - Factures étudiant
  - `createInvoice(invoiceData)` - Créer facture
  - `getPayments(studentId)` - Paiements étudiant
  - `recordPayment(paymentData)` - Enregistrer paiement
  - `getBalance(studentId)` - Solde étudiant

#### **Frontend (React Application)**
- **Type :** Single Page Application (SPA)
- **Technologie :** React 18 + TypeScript + Vite
- **Port :** 5173 (dev) / 5174 (alt)
- **Responsabilités :**
  - Interface utilisateur moderne et responsive
  - Gestion des rôles (Admin/Student/Professor)
  - Appels aux APIs REST et SOAP
  - Authentification JWT côté client
- **Stack UI :**
  - TailwindCSS pour le styling
  - shadcn/ui pour les composants
  - React Query pour le cache et les requêtes
  - React Router pour la navigation

---

## 3. ARCHITECTURE GÉNÉRALE

### 3.1 Diagramme d'Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT / FRONTEND                       │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY (9090)                      │
│              Spring Cloud / Routeur Central                  │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────┘
       │          │          │          │          │
   ┌───▼───┐  ┌──▼────┐  ┌──▼───┐  ┌──▼────┐  ┌──▼────┐
   │ Auth  │  │Student│  │Course│  │ Grade │  │Billing│
   │(8080) │  │(3000) │  │(8082)│  │(8000) │  │(8081) │
   └───┬───┘  └──┬────┘  └──┬───┘  └──┬────┘  └──┬────┘
       │         │          │         │          │
   ┌───▼──┐  ┌──▼──┐    ┌──▼──┐  ┌──▼──┐    ┌──▼──┐
   │MySQL │  │ MongoDB    MySQL│  │PG SQL    │MySQL│
   └──────┘  └─────┘     └─────┘  └──────┘   └─────┘
```

### 3.2 Flux de Requête Typique
1. Client envoie requête à l'API Gateway
2. API Gateway authentifie avec Auth Service
3. Routage vers le service approprié
4. Service traite la requête et BD
5. Service retourne la réponse
6. API Gateway agrège et retourne au client

### 3.3 Sécurité et Authentification
- **JWT (JSON Web Tokens)** pour l'authentification
- **Token Secret Partagé :** `MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters`
- **Validation JWT** sur tous les endpoints sauf authentification
- **CORS** activé pour l'interopérabilité
- **HTTPS** recommandé en production

---

## 4. SPÉCIFICATIONS TECHNIQUES

### 4.1 Technologies Utilisées

| Service | Langage | Framework | BD | Port |
|---------|---------|-----------|-----|------|
| Auth | Java 17 | Spring Boot 3.2 | MySQL | 8080 |
| Student | Node.js 18 | Express.js | MongoDB | 3000 |
| Course | Java 17 | Spring Boot 2.7 + Apache CXF | MySQL | 8082 |
| Grade | Python 3.9 | FastAPI | PostgreSQL | 8000 |
| Billing | Java 17 | Spring Boot 3.2 + Spring-WS | MySQL | 8081 |
| Frontend | TypeScript | React 18 + Vite | - | 5173 |

### 4.2 Versions Requises
- **Java :** 21 (JDK Temurin)
- **Node.js :** 18+ (Alpine)
- **Python :** 3.9+
- **Docker :** 24+
- **Docker Compose :** 2.0+

### 4.3 Dépendances Principales
- Spring Boot 3.x / Spring Cloud
- Express.js 4.x
- FastAPI 0.100+
- Apache CXF (SOAP)
- JJWT (JWT)
- Mongoose (MongoDB ODM)
- SQLAlchemy (ORM Python)

---

## 5. EXIGENCES FONCTIONNELLES

### 5.1 Authentification
- [x] Inscription utilisateur
- [x] Connexion avec credentials
- [x] Génération JWT
- [x] Validation et renouvellement de token
- [x] Déconnexion

### 5.2 Service Étudiant
- [x] CRUD complet des étudiants
- [x] Recherche et filtrage
- [x] Profils avec informations personnelles
- [x] Historique académique
- [x] Validation des données

### 5.3 Service Cours
- [x] Gestion des cours/modules
- [x] Emplois du temps
- [x] Gestion des enseignants
- [x] Prérequis et validations
- [x] Capacité des classes

### 5.4 Service Notes
- [x] Enregistrement des notes
- [x] Calcul des moyennes
- [x] Bulletins de notes
- [x] Historique complet
- [x] Statistiques par étudiant/cours

### 5.5 Service Facturation
- [x] Génération des factures
- [x] Enregistrement des paiements
- [x] Suivi des paiements
- [x] Calcul des intérêts/pénalités
- [x] Génération de rapports

---

## 6. EXIGENCES NON-FONCTIONNELLES

### 6.1 Performance
- Temps de réponse < 500ms pour 95% des requêtes
- Capacité : 1000 requêtes/seconde
- Disponibilité : 99.5%

### 6.2 Sécurité
- Authentification JWT obligatoire
- Encryption des données sensibles
- Validation des inputs
- Protection CSRF/CORS
- Logs d'audit

### 6.3 Scalabilité
- Architecture stateless
- Possible de déployer plusieurs instances
- Load balancing via API Gateway
- Caching des données fréquentes

### 6.4 Maintenabilité
- Code bien documenté
- Tests unitaires (couverture > 70%)
- Logging centralisé
- Configuration externalissée

---

## 7. ENVIRONNEMENT DE DÉPLOIEMENT

### 7.1 Conteneurisation
- **Docker :** Chaque service dans son conteneur
- **Docker Compose :** Orchestration locale développement
- **Volumes :** Persistance des bases de données
- **Networks :** Réseau bridge interne `soa-network`

### 7.2 Bases de Données
```yaml
Bases:
  - MySQL 8.0 (Port 3306)
  - MongoDB 6.0 (Port 27017)
  - PostgreSQL 15 (Port 5432)
Backups: Volumes Docker pour persistance
```

### 7.3 Structure du Projet
```
MiniProjetSOA/
├── documentation/
│   ├── cahier-des-charges.md
│   ├── specifications-techniques.md
│   └── manuel-utilisation.md
├── services/
│   ├── auth-service/
│   ├── student-service/
│   ├── course-service/
│   ├── grade-service/
│   ├── billing-service/
│   └── api-gateway/
├── docker-compose.yml
├── INSTRUCTIONS.md
├── README.md
└── presentations/
    ├── soutenance.pptx
    └── demo-video/
```

---

## 8. CRITÈRES D'ACCEPTATION

### 8.1 Fonctionnel
- [ ] Tous les services déployables
- [ ] Communication inter-services fonctionnelle
- [ ] Authentification JWT validée
- [ ] CRUD complets opérationnels
- [ ] Bases de données persistantes

### 8.2 Code
- [ ] Code clean et commenté
- [ ] Pas d'erreurs de compilation
- [ ] Respect des conventions (camelCase, etc.)
- [ ] Documentation du code

### 8.3 Déploiement
- [ ] Docker Compose fonctionnel
- [ ] Services démarrables sans erreurs
- [ ] Volumes de persistance configurés
- [ ] Logs accessibles

### 8.4 Documentation
- [ ] Cahier des charges complété
- [ ] Spécifications techniques détaillées
- [ ] Manuel d'utilisation avec exemples
- [ ] README dans chaque service

### 8.5 Présentation
- [ ] Soutenance claire et structurée
- [ ] Demo du système fonctionnelle
- [ ] Réponses aux questions techniques
- [ ] Justification des choix architecturaux

---

## 9. CALENDRIER

| Phase | Durée | Objectif |
|-------|-------|----------|
| Conception | 2 jours | Architecture et design |
| Développement | 7 jours | Implémentation services |
| Intégration | 2 jours | Tests et déploiement |
| Documentation | 2 jours | Rédaction complète |
| Soutenance | 1 jour | Présentation finale |

**Date Finale :** Semaine du 15/12/2024

---

## 10. NOTATION

### Compétences Techniques (14 points)
- Conception SOA : 3 points
- Services REST/SOAP : 5 points
- Interopérabilité : 2 points
- Déploiement Docker : 2 points
- Sécurité (bonus) : +2 points

### Compétences Méthodologiques (8 points)
- Travail en équipe : 2 points
- Documentation : 3 points
- Présentation : 3 points
- Agile (bonus) : +1 point

**Note Finale = 50% Note TP**

---

## 11. LIVRABLES

1. ✅ **Code source** - Tous les services + Gateway
2. ✅ **Docker Compose** - Configuration complète
3. ✅ **Documentation technique** - Spécifications + guides
4. ✅ **README** - Instructions de démarrage
5. ✅ **Tests** - Scripts de validation
6. ✅ **Soutenance** - Présentation PowerPoint
7. ✅ **Démo vidéo** - Capture d'écran du fonctionnement

---

## Fin du Cahier des Charges

**Version :** 2.0  
**Date :** 16 Décembre 2024  
**Auteur :** Équipe développement  
**Mise à jour :** Ajout du Frontend React, mise à jour des versions, suppression API Gateway
