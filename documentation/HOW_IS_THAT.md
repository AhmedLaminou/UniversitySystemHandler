# Comment Ça Marche ? - Guide Rapide

> Ce document explique en quelques mots comment l'architecture fonctionne pour répondre rapidement aux questions.

---

## 🏗️ Architecture en Un Coup d'Œil

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│                     Port 5173 (Vite Dev)                         │
└──────────────┬──────────────┬──────────────┬────────────────────┘
               │              │              │
    ┌──────────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
    │  AUTH SERVICE   │ │  BILLING  │ │   COURSE    │
    │   (REST+JWT)    │ │   (SOAP)  │ │   (SOAP)    │
    │   Port 8080     │ │ Port 8081 │ │  Port 8082  │
    └────────┬────────┘ └─────┬─────┘ └──────┬──────┘
             │                │              │
             ▼                ▼              ▼
    ┌────────────────────────────────────────────────┐
    │              MySQL (Port 3307)                  │
    │    auth_db  │  billing_db  │  course_db        │
    └────────────────────────────────────────────────┘

    ┌──────────────┐     ┌──────────────┐
    │    GRADE     │     │   STUDENT    │
    │    (REST)    │     │    (REST)    │
    │  Port 8000   │     │  Port 3000   │
    └──────┬───────┘     └──────┬───────┘
           │                    │
           ▼                    ▼
    ┌─────────────┐      ┌─────────────┐
    │  PostgreSQL │      │   MongoDB   │
    │  Port 5432  │      │ Port 27017  │
    └─────────────┘      └─────────────┘
```

---

## 🔑 Comment l'Authentification Fonctionne ?

1. **L'utilisateur se connecte** → Frontend envoie email/password à `auth-service`
2. **auth-service vérifie** dans MySQL (table `users`)
3. **Si OK** → Génère un **JWT Token** contenant: `{id, email, role, exp}`
4. **Le token est stocké** dans le localStorage du navigateur
5. **Chaque requête** vers les autres services inclut: `Authorization: Bearer <token>`
6. **Chaque service valide** le JWT avec la même clé secrète

```
🔐 Clé Secrète Partagée: APP_JWT_SECRET (env variable)
   Tous les services utilisent la MÊME clé pour valider les tokens
```

---

## 🗄️ Pourquoi des Bases de Données Différentes ?

### C'est le principe du **Polyglot Persistence** !

| Service | Base de Données | Pourquoi ? |
|---------|-----------------|------------|
| **Auth** | MySQL | Données relationnelles structurées (users, rôles) |
| **Billing** | MySQL | Transactions financières = ACID obligatoire |
| **Course** | MySQL | Relations cours ↔ étudiants ↔ emploi du temps |
| **Grade** | PostgreSQL | Calculs complexes (moyennes, statistiques) |
| **Student** | MongoDB | Données flexibles, documents JSON |

### Comment ils communiquent alors ?
- **Pas de jointures cross-database !**
- Chaque service expose une **API** (REST ou SOAP)
- Le **frontend** ou un service appelle l'API de l'autre
- Exemple: Pour afficher les notes d'un étudiant:
  1. Frontend récupère `studentId` depuis auth-service
  2. Frontend appelle grade-service avec ce `studentId`
  3. Le grade-service ne connaît que l'ID, pas les détails de l'étudiant

---

## 📡 REST vs SOAP - Qui Utilise Quoi ?

| Service | Protocole | Format | Pourquoi ? |
|---------|-----------|--------|------------|
| **auth-service** | REST | JSON | Simple, moderne, stateless |
| **student-service** | REST | JSON | CRUD basique, flexible |
| **grade-service** | REST | JSON | API Python FastAPI |
| **billing-service** | SOAP | XML | Entreprise, contrat strict (XSD) |
| **course-service** | SOAP | XML | Apache CXF, WSDL auto-généré |

### Exemple d'appel SOAP (Billing):
```xml
<soapenv:Envelope xmlns:bil="http://nexis.com/billing">
  <soapenv:Body>
    <bil:getInvoices>
      <studentId>STU001</studentId>
    </bil:getInvoices>
  </soapenv:Body>
</soapenv:Envelope>
```

---

## 🎭 Gestion des Rôles

### 3 Rôles Disponibles:
- **STUDENT** - Voit ses propres données uniquement
- **PROFESSOR** - Peut créer/modifier des notes
- **ADMIN** - Accès total à tout

### Comment le Frontend Sait ?
```javascript
const user = { role: "ADMIN" }; // Extrait du JWT
const isAdmin = user.role === "ADMIN";
// → Affiche différents menus selon le rôle
```

---

## 🐳 Docker - Tout en Conteneurs

### Un seul `docker-compose up` lance:
- 3 bases de données (MySQL, PostgreSQL, MongoDB)
- 5 microservices (Auth, Billing, Course, Grade, Student)
- Réseau isolé `soa-network` pour communication interne

### Les services se trouvent comment ?
```yaml
# Dans docker-compose.yml:
depends_on:
  - mysql  # Le service attend que MySQL soit prêt
networks:
  - soa-network  # Tous sur le même réseau Docker
```

**Nom DNS interne**: `mysql`, `postgres`, `mongodb` (pas localhost!)

---

## 🔄 Flux Typiques

### 1. Inscription d'un Étudiant
```
Frontend → POST /auth/register → auth-service → MySQL (users table)
         ← { id, email, role: "STUDENT" }
```

### 2. Consultation des Notes (Étudiant)
```
Frontend → GET /api/grades/student/123 → grade-service → PostgreSQL
         ← [{ course: "INF301", grade: 15.5 }, ...]
```

### 3. Création de Facture (Admin)
```
Frontend → SOAP createInvoice → billing-service → MySQL (billing_db)
         ← <invoice><id>INV-001</id>...</invoice>
```

---

## ⚡ Points Clés pour la Présentation

1. **Microservices** = Chaque service est indépendant, déployable seul
2. **Polyglot** = On choisit la bonne DB pour chaque besoin
3. **REST + SOAP** = On montre qu'on maîtrise les deux
4. **JWT** = Authentification stateless, token partagé
5. **Docker** = Déploiement facile, environnement reproductible
6. **Frontend React** = SPA moderne avec React Query pour le cache

---

## 🛠️ Technologies Utilisées

| Couche | Technologies |
|--------|--------------|
| **Frontend** | React 18, TypeScript, TailwindCSS, shadcn/ui |
| **Auth** | Spring Boot 3.2, Spring Security, JWT |
| **Billing** | Spring Boot 3.2, Spring-WS (SOAP) |
| **Course** | Spring Boot 2.7, Apache CXF (SOAP) |
| **Grade** | Python FastAPI |
| **Student** | Node.js Express |
| **Databases** | MySQL 8, PostgreSQL 15, MongoDB 6 |
| **Infra** | Docker, Docker Compose |

---

## 🎯 Questions Fréquentes

**Q: Pourquoi pas une seule base de données ?**
> Pour démontrer le polyglot persistence et l'indépendance des services.

**Q: Comment les services communiquent ?**
> Via HTTP (REST/SOAP), pas d'accès direct aux BDD des autres.

**Q: Comment on sécurise tout ça ?**
> JWT partagé + CORS configuré + validation côté backend.

**Q: Pourquoi SOAP pour billing ?**
> Pour montrer qu'on sait faire du SOAP (entreprise) en plus du REST.

**Q: Le frontend est où ?**
> Séparé, tourne sur Vite (port 5173), appelle les APIs.
