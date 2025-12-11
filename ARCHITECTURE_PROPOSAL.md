
# 📘 README.md — Architecture du Système SOA Universitaire

## 🎯 Introduction

Ce projet implémente un système universitaire distribué suivant une architecture **SOA (Service-Oriented Architecture)**.
Chaque service est indépendant, déployable séparément, et communique via **REST** ou **SOAP** selon les spécifications imposées.

L’objectif est de gérer l’ensemble des fonctionnalités d’une université : authentification, étudiants, cours, notes, facturation, et routage via une API Gateway.

---

# 🏛️ Vue d’Ensemble des Services

| Service          | Type       | Technologie     | Description                           |
| ---------------- | ---------- | --------------- | ------------------------------------- |
| Authentification | REST       | Spring Boot     | Gestion des utilisateurs + JWT        |
| Étudiants        | REST       | Node.js/Express | CRUD des étudiants                    |
| Cours            | SOAP       | Java JAX-WS     | Gestion des cours et emplois du temps |
| Notes            | REST       | Python/FastAPI  | Gestion des notes et moyennes         |
| Facturation      | SOAP       | .NET Core       | Gestion des frais universitaires      |
| API Gateway      | REST Proxy | Spring Cloud    | Routage, agrégation                   |

---

# 🧩 1. Service Authentification (Spring Boot – REST)

### 📁 Structure du Projet

```
auth-service/
 ├─ src/main/java/com/auth/
 │   ├─ controller/
 │   ├─ service/
 │   ├─ security/
 │   ├─ repository/
 │   ├─ model/
 │   └─ dto/
 └─ pom.xml
```

### 🧱 Modèles

#### `User`

```java
id: Long
username: String
password: String (hashé)
email: String
roles: Set<Role>
```

#### `Role`

```java
id: Long
name: String  
```

### 🔐 Fonctionnalités

* Inscription
* Login → génération JWT
* Vérification du token
* Filtrage des requêtes via Spring Security

### 🔗 Endpoints REST

| Méthode | Endpoint         | Description                 |
| ------- | ---------------- | --------------------------- |
| POST    | `/auth/register` | Création d’utilisateur      |
| POST    | `/auth/login`    | Authentification + JWT      |
| GET     | `/auth/me`       | Données utilisateur via JWT |

---

# 🧩 2. Service Étudiants (Node.js / Express – REST)

### 📁 Structure

```
student-service/
 ├─ controllers/
 ├─ models/
 ├─ routes/
 ├─ services/
 ├─ middleware/
 └─ index.js
```

### 🧱 Modèle

#### `Student`

```js
id: String (UUID)
firstName: String
lastName: String
email: String
department: String
birthDate: Date
```

### 🔗 Endpoints

| Méthode | Endpoint        | Description |
| ------- | --------------- | ----------- |
| GET     | `/students`     | Liste       |
| GET     | `/students/:id` | Détails     |
| POST    | `/students`     | Ajouter     |
| PUT     | `/students/:id` | Modifier    |
| DELETE  | `/students/:id` | Supprimer   |

---

# 🧩 3. Service Cours (Java JAX-WS – SOAP)

### 📁 Structure

```
course-service/
 ├─ src/
 │   ├─ CourseService.java
 │   ├─ CourseRepository.java
 │   ├─ models/
 │   ├─ wsdl/
 │   └─ CourseEndpoint.java
 └─ pom.xml
```

### 🧱 Modèle

#### `Course`

```
id: Long
title: String
credits: int
teacher: String
schedule: String
```

### 🧱 Méthodes SOAP

* `getCourseById(id)`
* `getAllCourses()`
* `createCourse(course)`
* `updateCourse(course)`
* `deleteCourse(id)`

### 📄 WSDL

Généré automatiquement via JAX-WS.

---

# 🧩 4. Service Notes (FastAPI – REST)

### 📁 Structure

```
notes-service/
 ├─ app/
 │   ├─ main.py
 │   ├─ models.py
 │   ├─ routes.py
 │   ├─ services.py
 │   └─ database.py
```

### 🧱 Modèle

#### `Grade`

```python
id: int
student_id: str
course_id: int
grade: float
```

### 🔢 Calcul des Moyennes

* Moyenne par étudiant
* Moyenne par cours

### 🔗 Endpoints

| Méthode | Endpoint               |
| ------- | ---------------------- |
| GET     | `/grades`              |
| GET     | `/grades/student/{id}` |
| POST    | `/grades`              |
| PUT     | `/grades/{id}`         |
| DELETE  | `/grades/{id}`         |

---

# 🧩 5. Service Facturation (SOAP .NET Core)

### 📁 Structure

```
billing-service/
 ├─ Controllers/
 ├─ Models/
 ├─ Services/
 ├─ Repositories/
 └─ BillingService.asmx
```

### 🧱 Modèle `Invoice`

```
id: int
studentId: string
amount: decimal
status: string (PAID / UNPAID)
dueDate: Date
```

### ⚙️ Méthodes SOAP

* `GenerateInvoice(studentId)`
* `GetInvoice(id)`
* `PayInvoice(id)`
* `ListInvoices(studentId)`

---

# 🧩 6. API Gateway (Spring Cloud Gateway – REST reverse proxy)

### 📁 Structure

```
api-gateway/
 ├─ src/main/java/com/gateway/
 │   ├─ config/
 │   └─ filters/
 └─ application.yml
```

### 🔗 Routage Proposé

| Path Gateway   | Redirection         |
| -------------- | ------------------- |
| `/auth/**`     | Auth Service        |
| `/students/**` | Student Service     |
| `/courses/**`  | Course SOAP Service |
| `/grades/**`   | Notes Service       |
| `/billing/**`  | Facturation SOAP    |

### 🛡️ Fonctions

* Validation JWT
* Logging des requêtes
* Fuseau pour microservices down

---

# 🧰 Technologies Résumées

* **Spring Boot** — Auth + Gateway
* **Node.js / Express** — Étudiants
* **FastAPI** — Notes
* **Java JAX-WS** — SOAP Cours
* **.NET Core SOAP** — Facturation
* **Docker** — orchestrer tous les services

---

# 📦 Docker & Déploiement

### Exemple d’un `docker-compose.yml`

(à compléter selon vos ports finaux)

```yaml
services:
  auth:
    build: ./services/auth-service
    ports: ["8081:8081"]

  students:
    build: ./services/student-service
    ports: ["3000:3000"]

  courses:
    build: ./services/course-service
    ports: ["8082:8082"]

  notes:
    build: ./services/notes-service
    ports: ["8000:8000"]

  billing:
    build: ./services/billing-service
    ports: ["8090:80"]

  gateway:
    build: ./gateway
    ports: ["8080:8080"]
```

---

# 🏁 Conclusion

Ce README constitue :

✔️ l’architecture interne complète
✔️ les modèles de données pour chaque service
✔️ les endpoints REST/SOAP
✔️ les dossiers et responsabilités
✔️ la structure multi-technologie cohérente
✔️ le routage centralisé via Gateway

Tu peux le coller *tel quel* dans ton repo.

---

Si tu veux, je peux aussi faire :

🔥 **un second README détaillé par service**
🔥 **un diagramme UML pour chaque service**
🔥 **un diagramme global d'architecture (PlantUML / Mermaid)**
🔥 **un docker-compose COMPLET fonctionnel**

Juste dis-moi ce que tu veux en prochain round, Ahmed.
