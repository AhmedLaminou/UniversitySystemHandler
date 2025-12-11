<<<<<<< HEAD

---

```markdown
# 🏛️ Mini-Projet SOA Université — Architecture Distribuée

![Java](https://img.shields.io/badge/Java-17-orange)
![SpringBoot](https://img.shields.io/badge/Spring%20Boot-REST-success)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green)
![Python](https://img.shields.io/badge/Python-FastAPI-blue)
![.NET](https://img.shields.io/badge/.NET-SOAP-purple)
![Docker](https://img.shields.io/badge/Docker-Compose-informational)
![SOA](https://img.shields.io/badge/Architecture-SOA-important)

Projet académique visant à implémenter une architecture orientée services (SOA) composée de microservices REST et SOAP hétérogènes, orchestrés par un API Gateway et conteneurisés via Docker.

---

## 🎯 Objectifs pédagogiques

- Concevoir et implémenter une architecture SOA multi-technologies.
- Développer des services Web **REST (JSON)** et **SOAP (XML)**.
- Gérer l’**interopérabilité entre services** (langages + protocoles différents).
- Implémenter la sécurité → **JWT (JSON Web Token)**.
- Conteneuriser et orchestrer via **Docker / docker-compose**.
- Travailler en équipe (gestion, documentation, présentation).

---

# 🧱 Architecture globale

```

┌─────────────────────────────┐
│         API Gateway         │
│        Spring Cloud         │
└────────────┬───────────────┘
│
┌────────────┼──────────────────────────────┐
│            │                              │
│     REST Services                    SOAP Services
│
│ ┌──────────────┐  ┌──────────────┐     ┌──────────────┐
│ │ Auth Service │  │ Student Serv │     │ Course Serv  │
│ │ SpringBoot   │  │ Node/Express │     │ Java / JAXWS │
│ └──────────────┘  └──────────────┘     └──────────────┘
│
│ ┌──────────────┐                      ┌──────────────┐
│ │ Grade Serv   │                      │ Billing Serv │
│ │ Python/FastAPI│                     │ .NET SOAP    │
│ └──────────────┘                      └──────────────┘
└─────────────────────────────────────────────────────────

```

---

# 🧰 Technologies par service

| Service | Type | Technologie | Responsabilités |
|--------|------|------------|----------------|
| Auth | REST | Spring Boot | Gestion utilisateurs + JWT |
| Students | REST | Node.js / Express | CRUD étudiants |
| Courses | SOAP | Java / JAX-WS | Cours + emplois du temps |
| Grades | REST | FastAPI | Notes + moyennes |
| Billing | SOAP | .NET Core | Facturation universitaire |
| API Gateway | REST | Spring Cloud | Routage + agrégation |

---

# 📂 Structure du projet (obligatoire)

```

projet-soa-universite/
│
├── documentation/
│   ├── cahier-des-charges.md
│   ├── specifications-techniques.md
│   └── manuel-utilisation.md
│
├── services/
│   ├── auth-service/
│   ├── student-service/
│   ├── course-service/
│   ├── grade-service/
│   ├── billing-service/
│   └── api-gateway/
│
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfiles/
│
└── presentations/
├── soutenance-finale.pptx
└── demo-video.mp4

```

---

# 🧑‍🤝‍🧑 Travail collaboratif (binôme)

## Répartition recommandée

### Dev A — Java / Architecture
- Auth service (Spring + JWT)
- API Gateway
- Course SOAP (JAX-WS)
- Documentation technique d’architecture

### Dev B — Node / Python / .NET
- Student service (Express)
- Grade service (FastAPI)
- Billing SOAP (.NET)
- Tests API

Ensuite :
- Docker + intégration
- Documentation
- Présentation

> Pro-tip : **Ne codez pas simultanément dans le même service.**

---

# 🛠️ Outils conseillés

### Communication
- Slack / Discord
- Channels : `#auth`, `#student`, `#soap`, `#gateway`, `#docker`

### Code
- **GitHub**
- Branches standard :
```

feature/auth
feature/student
feature/course-soap
feature/grade
feature/billing
feature/gateway
feature/docker

```

### Gestion de projet
- **GitHub Projects (Kanban)**
```

TODO → In Progress → Review → Done

```

### Tests API
- Postman / Insomnia
- Groupe de tests = par service
- Export → `/documentation/postman_collection.json`

### Conteneurisation
- Docker Desktop
- Dockerfile = 1 par microservice
- docker-compose = orchestration globale

---

# 🚀 Getting Started

## 1️⃣ Cloner le dépôt
```

git clone [https://github.com/username/projet-soa-universite.git](https://github.com/username/projet-soa-universite.git)
cd projet-soa-universite

```

## 2️⃣ Installer dépendances service par service

### Auth — Spring Boot
```

cd services/auth-service
mvn clean install

```

### Students — Express
```

cd services/student-service
npm install

```

### Grades — FastAPI
```

cd services/grade-service
pip install -r requirements.txt

```

### Courses — SOAP JAX-WS
- `mvn package`

### Billing — .NET SOAP
```

cd services/billing-service
dotnet restore

```

---

# 🔐 Authentification — JWT

### Flow
1. `POST /auth/login` → credentials
2. Auth-service retourne un JWT signé
3. Client ajoute `Authorization: Bearer <token>`
4. Tous les services REST vérifient :
   - validité
   - signature
   - expiration

Les services SOAP passent par :
- Header personnalisé
- ou API Gateway

---

# 🔁 API Gateway

Responsabilités :
- Routing
- Aggregation
- Auth filtering
- Load balancing (simple)

Exemple :
```

/api/students
/api/courses
/api/billing
/api/grades

```

---

# 🔗 Interopérabilité

- REST → JSON
- SOAP → XML + WSDL
- Spring Cloud → glue organisationnelle

Exemple d’agrégation (via Gateway) :
```

Client → /api/student/{id}/details
Gateway → Student + Grades + Billing
Gateway → réponse combinée JSON

```

---

# 🧾 Modèle de données (simplifié)

## Student
```

id, firstname, lastname, email, birthdate

```

## Course
```

id, title, credits, schedule

```

## Grade
```

id, studentId, courseId, grade

```

## Billing
```

id, studentId, amount, status

```

---

# 📡 Diagramme de flux (simplifié)

```

Client → Gateway → Auth: login → JWT
Client → Gateway (Bearer token)
Gateway → Student
Gateway → Grades
Gateway → retour JSON

```

---

# 🐳 Dockerisation

Chaque service = 1 Dockerfile

Exemple minimal :
```

FROM openjdk:17
COPY target/app.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

```

Orchestration :
```

docker/
├── docker-compose.yml
└── Dockerfiles/

```

### Commandes
```

docker compose up --build
docker compose down

```

---

# 📘 Documentation à fournir

### 📄 Cahier des Charges
- Contexte
- Objectifs
- Diagrammes d’architecture
- Use cases

### 📄 Spécifications techniques
- REST endpoints (inputs/outputs)
- SOAP opérations + WSDL
- JWT flow
- Diagrammes UML

### 📄 Manuel utilisateur
- Installation locale
- Docker
- Appels API
- Cas d’usage

---

# 🎥 Soutenance
- Présentation 6–10 slides
- Démo live ou vidéo (5–8 min)
- Réponses aux questions

---

# ⚠️ Erreurs à éviter

- ❌ tout dans un seul service
- ❌ tout en Node / tout en Java
- ❌ pas de Docker
- ❌ pas de doc
- ❌ tests au dernier moment
- ❌ Gateway absente
- ❌ binôme : 1 code / 1 regarde

---

# 🚀 Checklist finale

- [ ] 6 services indépendants
- [ ] REST + SOAP OK
- [ ] Auth JWT OK
- [ ] API Gateway OK
- [ ] Docker OK
- [ ] Documentation OK
- [ ] Présentation prête
- [ ] Tests Postman validés

---

## 🤝 Contribution

Les PR (Pull Requests) doivent :
- Avoir un titre clair
- Être liées à une issue
- Être reviewées par l’autre membre

---

## 📄 Licence
Projet académique — non destiné à la production.

---
```

---

Si tu veux, je peux **ajouter un vrai `docker-compose.yml` complet + les Dockerfiles minimaux pour chaque service** (Spring / Express / FastAPI / .NET / SOAP).
=======

---

```markdown
# 🏛️ Mini-Projet SOA Université — Architecture Distribuée

![Java](https://img.shields.io/badge/Java-17-orange)
![SpringBoot](https://img.shields.io/badge/Spring%20Boot-REST-success)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green)
![Python](https://img.shields.io/badge/Python-FastAPI-blue)
![.NET](https://img.shields.io/badge/.NET-SOAP-purple)
![Docker](https://img.shields.io/badge/Docker-Compose-informational)
![SOA](https://img.shields.io/badge/Architecture-SOA-important)

Projet académique visant à implémenter une architecture orientée services (SOA) composée de microservices REST et SOAP hétérogènes, orchestrés par un API Gateway et conteneurisés via Docker.

---

## 🎯 Objectifs pédagogiques

- Concevoir et implémenter une architecture SOA multi-technologies.
- Développer des services Web **REST (JSON)** et **SOAP (XML)**.
- Gérer l’**interopérabilité entre services** (langages + protocoles différents).
- Implémenter la sécurité → **JWT (JSON Web Token)**.
- Conteneuriser et orchestrer via **Docker / docker-compose**.
- Travailler en équipe (gestion, documentation, présentation).

---

# 🧱 Architecture globale

```

┌─────────────────────────────┐
│         API Gateway         │
│        Spring Cloud         │
└────────────┬───────────────┘
│
┌────────────┼──────────────────────────────┐
│            │                              │
│     REST Services                    SOAP Services
│
│ ┌──────────────┐  ┌──────────────┐     ┌──────────────┐
│ │ Auth Service │  │ Student Serv │     │ Course Serv  │
│ │ SpringBoot   │  │ Node/Express │     │ Java / JAXWS │
│ └──────────────┘  └──────────────┘     └──────────────┘
│
│ ┌──────────────┐                      ┌──────────────┐
│ │ Grade Serv   │                      │ Billing Serv │
│ │ Python/FastAPI│                     │ .NET SOAP    │
│ └──────────────┘                      └──────────────┘
└─────────────────────────────────────────────────────────

```

---

# 🧰 Technologies par service

| Service | Type | Technologie | Responsabilités |
|--------|------|------------|----------------|
| Auth | REST | Spring Boot | Gestion utilisateurs + JWT |
| Students | REST | Node.js / Express | CRUD étudiants |
| Courses | SOAP | Java / JAX-WS | Cours + emplois du temps |
| Grades | REST | FastAPI | Notes + moyennes |
| Billing | SOAP | .NET Core | Facturation universitaire |
| API Gateway | REST | Spring Cloud | Routage + agrégation |

---

# 📂 Structure du projet (obligatoire)

```

projet-soa-universite/
│
├── documentation/
│   ├── cahier-des-charges.md
│   ├── specifications-techniques.md
│   └── manuel-utilisation.md
│
├── services/
│   ├── auth-service/
│   ├── student-service/
│   ├── course-service/
│   ├── grade-service/
│   ├── billing-service/
│   └── api-gateway/
│
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfiles/
│
└── presentations/
├── soutenance-finale.pptx
└── demo-video.mp4

```

---

# 🧑‍🤝‍🧑 Travail collaboratif (binôme)

## Répartition recommandée

### Dev A — Java / Architecture
- Auth service (Spring + JWT)
- API Gateway
- Course SOAP (JAX-WS)
- Documentation technique d’architecture

### Dev B — Node / Python / .NET
- Student service (Express)
- Grade service (FastAPI)
- Billing SOAP (.NET)
- Tests API

Ensuite :
- Docker + intégration
- Documentation
- Présentation

> Pro-tip : **Ne codez pas simultanément dans le même service.**

---

# 🛠️ Outils conseillés

### Communication
- Slack / Discord
- Channels : `#auth`, `#student`, `#soap`, `#gateway`, `#docker`

### Code
- **GitHub**
- Branches standard :
```

feature/auth
feature/student
feature/course-soap
feature/grade
feature/billing
feature/gateway
feature/docker

```

### Gestion de projet
- **GitHub Projects (Kanban)**
```

TODO → In Progress → Review → Done

```

### Tests API
- Postman / Insomnia
- Groupe de tests = par service
- Export → `/documentation/postman_collection.json`

### Conteneurisation
- Docker Desktop
- Dockerfile = 1 par microservice
- docker-compose = orchestration globale

---

# 🚀 Getting Started

## 1️⃣ Cloner le dépôt
```

git clone [https://github.com/username/projet-soa-universite.git](https://github.com/username/projet-soa-universite.git)
cd projet-soa-universite

```

## 2️⃣ Installer dépendances service par service

### Auth — Spring Boot
```

cd services/auth-service
mvn clean install

```

### Students — Express
```

cd services/student-service
npm install

```

### Grades — FastAPI
```

cd services/grade-service
pip install -r requirements.txt

```

### Courses — SOAP JAX-WS
- `mvn package`

### Billing — .NET SOAP
```

cd services/billing-service
dotnet restore

```

---

# 🔐 Authentification — JWT

### Flow
1. `POST /auth/login` → credentials
2. Auth-service retourne un JWT signé
3. Client ajoute `Authorization: Bearer <token>`
4. Tous les services REST vérifient :
   - validité
   - signature
   - expiration

Les services SOAP passent par :
- Header personnalisé
- ou API Gateway

---

# 🔁 API Gateway

Responsabilités :
- Routing
- Aggregation
- Auth filtering
- Load balancing (simple)

Exemple :
```

/api/students
/api/courses
/api/billing
/api/grades

```

---

# 🔗 Interopérabilité

- REST → JSON
- SOAP → XML + WSDL
- Spring Cloud → glue organisationnelle

Exemple d’agrégation (via Gateway) :
```

Client → /api/student/{id}/details
Gateway → Student + Grades + Billing
Gateway → réponse combinée JSON

```

---

# 🧾 Modèle de données (simplifié)

## Student
```

id, firstname, lastname, email, birthdate

```

## Course
```

id, title, credits, schedule

```

## Grade
```

id, studentId, courseId, grade

```

## Billing
```

id, studentId, amount, status

```

---

# 📡 Diagramme de flux (simplifié)

```

Client → Gateway → Auth: login → JWT
Client → Gateway (Bearer token)
Gateway → Student
Gateway → Grades
Gateway → retour JSON

```

---

# 🐳 Dockerisation

Chaque service = 1 Dockerfile

Exemple minimal :
```

FROM openjdk:17
COPY target/app.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

```

Orchestration :
```

docker/
├── docker-compose.yml
└── Dockerfiles/

```

### Commandes
```

docker compose up --build
docker compose down

```

---

# 📘 Documentation à fournir

### 📄 Cahier des Charges
- Contexte
- Objectifs
- Diagrammes d’architecture
- Use cases

### 📄 Spécifications techniques
- REST endpoints (inputs/outputs)
- SOAP opérations + WSDL
- JWT flow
- Diagrammes UML

### 📄 Manuel utilisateur
- Installation locale
- Docker
- Appels API
- Cas d’usage

---

# 🎥 Soutenance
- Présentation 6–10 slides
- Démo live ou vidéo (5–8 min)
- Réponses aux questions

---

# ⚠️ Erreurs à éviter

- ❌ tout dans un seul service
- ❌ tout en Node / tout en Java
- ❌ pas de Docker
- ❌ pas de doc
- ❌ tests au dernier moment
- ❌ Gateway absente
- ❌ binôme : 1 code / 1 regarde

---

# 🚀 Checklist finale

- [ ] 6 services indépendants
- [ ] REST + SOAP OK
- [ ] Auth JWT OK
- [ ] API Gateway OK
- [ ] Docker OK
- [ ] Documentation OK
- [ ] Présentation prête
- [ ] Tests Postman validés

---

## 🤝 Contribution

Les PR (Pull Requests) doivent :
- Avoir un titre clair
- Être liées à une issue
- Être reviewées par l’autre membre

---

## 📄 Licence
Projet académique — non destiné à la production.

---
```

---

Si tu veux, je peux **ajouter un vrai `docker-compose.yml` complet + les Dockerfiles minimaux pour chaque service** (Spring / Express / FastAPI / .NET / SOAP).
>>>>>>> cf0c56c (Add BillingService)
