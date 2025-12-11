# 🎓 Mini-Projet SOA Université

Projet académique visant à concevoir une architecture orientée services (SOA) composée de services REST & SOAP interopérables.  
Chaque service est développé avec **une technologie différente**, conteneurisé et orchestré via Docker + API Gateway.

---

## 🧠 Objectifs pédagogiques

- Comprendre et concevoir une architecture **SOA réelle**.
- Développer et intégrer des services **REST** et **SOAP**.
- Gérer l'**interopérabilité** entre systèmes hétérogènes.
- Implémenter des concepts clés :
  - Authentification basée JWT
  - API Gateway
  - Microservices
  - Conteneurisation Docker
- Travailler en équipe avec **répartition claire des rôles**.
- Documenter les services et la solution finale.

---

## 🧱 Architecture à implémenter

### 🏛️ Services principaux

| Service | Type | Tech | Responsabilités |
|-------|------|------|----------------|
| **Auth Service** | REST | Spring Boot | Gestion des utilisateurs et JWT |
| **Student Service** | REST | Node.js / Express | CRUD étudiants |
| **Course Service** | SOAP | Java / JAX-WS | Gestion des cours et emplois du temps |
| **Grade Service** | REST | Python / FastAPI | Notes, calcul moyennes |
| **Billing Service** | SOAP | .NET Core | Gestion de la facturation |
| **API Gateway** | REST | Spring Cloud | Routage, agrégation des services |

👉 **Chaque service est indépendant**, avec son propre répertoire, sa documentation et son Dockerfile.

---

## 📂 Structure du projet (imposée)

projet-soa-universite/
│
├── documentation/
│ ├── cahier-des-charges.md
│ ├── specifications-techniques.md
│ └── manuel-utilisation.md
│
├── services/
│ ├── auth-service/
│ ├── student-service/
│ ├── course-service/
│ ├── grade-service/
│ ├── billing-service/
│ └── api-gateway/
│
├── docker/
│ ├── docker-compose.yml
│ └── Dockerfiles/
│
└── presentations/
├── soutenance-finale.pptx
└── demo-video.mp4

---

# 👥 Travail collaboratif à 2 — Méthode recommandée

## 🧩 Répartition des rôles (exemple)

### 🔹 Dev A (Java / Backend)

- Auth Service (Spring Boot + JWT)
- API Gateway
- Course Service (SOAP / JAX-WS)

### 🔹 Dev B (Node / Python / .NET)

- Student Service (Express)
- Grade Service (FastAPI)
- Billing Service (SOAP .NET Core)

Puis :

- Intégration Docker
- Tests API
- Documentation

---

# 🔧 Outils recommandés

## 🔥 Collaboration & Communication

- **Slack / Discord**
  - Canaux : `#dev`, `#tests`, `#issues`
- Réunions régulières
- Journal de suivi simple

## 💻 Code & gestion

- **GitHub**
  - Repo principal → arborescence imposée
  - Branches par service :

//
main
feature/auth
feature/student
feature/course
feature/grade
feature/billing
feature/gateway
feature/docker

### 🔁 Workflow Git (simple et efficace)

1. `git pull`
2. créer branche → travailler → commit
3. ouvrir la Pull Request
4. review -> merge

---

## 🗂️ Gestion de projet

### 👉 **GitHub Projects (Kanban)**

Colonnes :

- TODO
- In Progress
- In Review
- Done

Tâches typiques :

- Auth: endpoints + JWT
- Student: CRUD + test API
- Course SOAP: WSDL + endpoints
- Gateway routing
- Dockerization
- Documentation

---

## 🧪 Tests & Validation

- **Postman / Insomnia**
  - Collections d’API par service
  - Tests JWT
  - Exporter dans `/documentation/`

---

## 🐳 Conteneurisation

- Docker Desktop
- Dockerfiles → 1 par microservice
- `docker-compose.yml` racine

Objectif :

- **1 commande = tout fonctionne**

Exemple :
docker compose up --build

---

# 📚 Documentation à produire

## documentation/cahier-des-charges.md

- Contexte
- Besoins fonctionnels
- Diagramme SOA
- Découpage des services

## documentation/specifications-techniques.md

- Endpoints REST + SOAP (routes, input, output)
- JWT & Auth
- Schémas JSON / XML
- ERD (modèle de données)
- Diagrammes sequence

## documentation/manuel-utilisation.md

- Installation locale
- Docker setup
- API usage
- User guide

---

# ✔️ Livrables finaux

- Projet fonctionnel conteneurisé
- Documentation complète
- Présentation PPT
- Vidéo démo (5–8 min)

---


---

# 💡 Conseils pratiques

- Commence simple → MVP par service
- Faites tourner chaque service **indépendamment**
- Ensuite seulement → API Gateway
- Testez en continu
- Docker n’est pas une décoration, c’est l’évaluation

---

# 🏁 Conclusion

Ce mini-projet imite le **monde réel** :

- services indépendants
- technologies diverses
- communication inter-services
- conteneurisation
- documentation
- travail en équipe

Si vous respectez l’architecture, la doc et une bonne organisation, **vous gagnez des points sans souffrir**.

---
