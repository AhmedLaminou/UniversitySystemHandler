# Spécifications Techniques - Système SOA Universitaire

## 1. ARCHITECTURE GLOBALE

### 1.1 Vue d'Ensemble
```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React SPA)                        │
│        Port 5173 - TypeScript + TailwindCSS + shadcn/ui       │
└────────────┬────────────┬───────────┬──────────┬───────────┘
            │            │           │          │
   HTTP/REST│   HTTP/REST│  SOAP/XML │ REST/JSON│  SOAP/XML
            │            │           │          │
      ┌─────▼────┐  ┌────▼────┐  ┌──▼───┐  ┌──▼───┐  ┌──▼────┐
      │   Auth   │  │ Student │  │Course│  │ Grade│  │Billing│
      │   8080   │  │  3000   │  │ 8082 │  │ 8000 │  │ 8081  │
      └────┬─────┘  └───┬─────┘  └──┬────┘  └──┬────┘  └──┬─────┘
           │            │          │         │          │
      ┌────▼───────────▼──────────▼─────────┐          │
      │          MySQL (Port 3307)         │    ┌────▼─────┐
      │   auth_db | billing_db | course_db │    │ PostgreSQL│
      └────────────────────────────────────────┘    │   5432    │
                                                └───────────┘
            ┌────────────────────┐
            │  MongoDB (27017)   │
            │    student_db      │
            └────────────────────┘
         
         DOCKER COMPOSE NETWORK (soa-network)
```

### 1.2 Patterns Architecturaux
- **Microservices Pattern** - Services indépendants et déployables séparément
- **JWT Authentication** - Sécurité distribuée avec clé partagée
- **SOAP/REST Coexistence** - Interopérabilité avec 2 protocoles
- **Polyglot Persistence** - MySQL, PostgreSQL, MongoDB selon les besoins
- **Frontend SPA** - React avec React Query pour cache intelligent

---

## 2. SERVICES DÉTAILLÉS

### 2.1 Service Authentification (Auth Service)

#### Configuration
```properties
Service Name: auth-service
Technology Stack: Java 17 + Spring Boot 3.2
Port: 8080
Database: MySQL 8.0
JWT Secret: MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters
JWT Expiration: 86400 (24 heures)
```

#### Architecture Interne
```
Request → Spring Security Filter
        → AuthController
        → UserService
        → JwtTokenProvider (génération/validation)
        → UserRepository
        → MySQL Database
        → Response (Token ou Error)
```

#### Endpoints API
```http
POST /auth/register
Content-Type: application/json

{
  "username": "etudiant@example.com",
  "password": "SecurePassword123",
  "firstName": "Ahmed",
  "lastName": "Laminou",
  "role": "STUDENT"
}

Response: { "id": "uuid", "username": "...", "token": "jwt_token" }
```

```http
POST /auth/login
Content-Type: application/json

{
  "username": "etudiant@example.com",
  "password": "SecurePassword123"
}

Response: { 
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "refreshToken": "..."
}
```

```http
POST /auth/validate
Authorization: Bearer {token}

Response: { "valid": true, "userId": "uuid", "username": "..." }
```

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: { "token": "new_jwt_token", "expiresIn": 86400 }
```

#### Dépendances Maven
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
```

#### Base de Données
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  role ENUM('ADMIN', 'STUDENT', 'PROFESSOR'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token TEXT NOT NULL,
  expiration_date DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### 2.2 Service Étudiants (Student Service)

#### Configuration
```properties
Service Name: student-service
Technology Stack: Node.js 18 + Express.js
Port: 3000
Database: MongoDB 6.0
Database URL: mongodb://mongodb:27017/student_db
```

#### Architecture Interne
```
Request → AuthMiddleware (JWT validation)
       → ExpressRouter
       → StudentController
       → StudentService
       → StudentRepository (Mongoose)
       → MongoDB
       → Response
```

#### Endpoints API REST
```http
GET /api/students
Authorization: Bearer {token}

Response: [
  {
    "_id": "objectid",
    "matricule": "STU001",
    "firstName": "Ahmed",
    "lastName": "Laminou",
    "email": "ahmed@university.edu",
    "program": "Génie Logiciel",
    "enrollmentDate": "2022-09-01",
    "status": "active"
  }
]
```

```http
POST /api/students
Authorization: Bearer {token}
Content-Type: application/json

{
  "matricule": "STU002",
  "firstName": "Fatima",
  "lastName": "Ben",
  "email": "fatima@university.edu",
  "program": "Génie Logiciel",
  "enrollmentDate": "2024-09-01"
}

Response: { "_id": "...", "matricule": "STU002", ... }
```

```http
GET /api/students/:studentId
Authorization: Bearer {token}

Response: { 
  "_id": "...",
  "matricule": "STU001",
  "firstName": "Ahmed",
  "lastName": "Laminou",
  "enrolledCourses": ["COURSE001", "COURSE002"],
  "grades": [...],
  "transcript": {...}
}
```

#### Schéma MongoDB
```javascript
// Student Collection
db.students.insertOne({
  _id: ObjectId(),
  matricule: "STU001",
  firstName: "Ahmed",
  lastName: "Laminou",
  email: "ahmed@university.edu",
  program: "Génie Logiciel",
  enrollmentDate: ISODate("2022-09-01"),
  status: "active",
  phone: "+216987654321",
  address: "Tunis, Tunisia",
  enrolledCourses: [ObjectId("COURSE001"), ObjectId("COURSE002")],
  createdAt: ISODate(),
  updatedAt: ISODate()
});
```

#### Dépendances NPM
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5"
  }
}
```

---

### 2.3 Service Cours (Course Service)

#### Configuration
```properties
Service Name: course-service
Technology Stack: Java 11 + Apache CXF (SOAP)
Port: 8082
Database: MySQL 8.0
WSDL Endpoint: http://localhost:8082/services/course?wsdl
```

#### Architecture SOAP
```
Request → SOAP Handler
       → CourseServiceImpl (Web Service)
       → CourseService (Business Logic)
       → CourseRepository (JPA)
       → MySQL Database
       → SOAP Response
```

#### Web Service SOAP
```xml
<?xml version="1.0" encoding="UTF-8"?>
<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
                   xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
                   targetNamespace="http://course.nexis.com">
  
  <wsdl:types>
    <xsd:schema targetNamespace="http://course.nexis.com">
      <xsd:element name="Course">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="id" type="xsd:string"/>
            <xsd:element name="code" type="xsd:string"/>
            <xsd:element name="title" type="xsd:string"/>
            <xsd:element name="credits" type="xsd:int"/>
            <xsd:element name="department" type="xsd:string"/>
            <xsd:element name="instructors" type="xsd:string" maxOccurs="unbounded"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </wsdl:types>

  <wsdl:message name="GetCoursesRequest"/>
  <wsdl:message name="GetCoursesResponse">
    <wsdl:part name="courses" element="Course" maxOccurs="unbounded"/>
  </wsdl:message>

  <wsdl:portType name="CourseServicePortType">
    <wsdl:operation name="getCourses">
      <wsdl:input message="GetCoursesRequest"/>
      <wsdl:output message="GetCoursesResponse"/>
    </wsdl:operation>
  </wsdl:portType>

  <wsdl:binding name="CourseServiceBinding" type="CourseServicePortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <wsdl:operation name="getCourses">
      <soap:operation soapAction="getCourses"/>
      <wsdl:input><soap:body use="literal"/></wsdl:input>
      <wsdl:output><soap:body use="literal"/></wsdl:output>
    </wsdl:operation>
  </wsdl:binding>
</wsdl:definitions>
```

#### Opérations SOAP
```xml
<!-- Request -->
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:cou="http://course.nexis.com">
   <soapenv:Header/>
   <soapenv:Body>
      <cou:getCourses/>
   </soapenv:Body>
</soapenv:Envelope>

<!-- Response -->
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Body>
      <cou:getCoursesResponse>
         <course>
            <id>COURSE001</id>
            <code>SOA101</code>
            <title>Introduction à SOA</title>
            <credits>3</credits>
            <department>Génie Logiciel</department>
         </course>
      </cou:getCoursesResponse>
   </soapenv:Body>
</soapenv:Envelope>
```

#### Table MySQL
```sql
CREATE TABLE courses (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  credits INT NOT NULL,
  department VARCHAR(100),
  capacity INT DEFAULT 50,
  current_enrollment INT DEFAULT 0,
  semester VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_department (department)
);

CREATE TABLE course_instructors (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  instructor_id VARCHAR(36) NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

---

### 2.4 Service Notes (Grade Service)

#### Configuration
```properties
Service Name: grade-service
Technology Stack: Python 3.9 + FastAPI
Port: 8000
Database: PostgreSQL 15
Database URL: postgresql://user:password@postgres:5432/grade_db
```

#### Architecture FastAPI
```
Request → Security Dependency (OAuth2PasswordBearer)
       → APIRouter
       → GradeService (Business Logic)
       → SQLAlchemy ORM
       → PostgreSQL Database
       → JSONResponse
```

#### Endpoints FastAPI
```http
GET /api/grades
Authorization: Bearer {token}

Response: [
  {
    "id": "uuid",
    "student_id": "STU001",
    "course_id": "COURSE001",
    "grade": 85.5,
    "letter_grade": "B",
    "date": "2024-12-15"
  }
]
```

```http
POST /api/grades
Authorization: Bearer {token}
Content-Type: application/json

{
  "student_id": "STU001",
  "course_id": "COURSE001",
  "grade": 92.0
}

Response: {
  "id": "uuid",
  "student_id": "STU001",
  "course_id": "COURSE001",
  "grade": 92.0,
  "letter_grade": "A",
  "date": "2024-12-15"
}
```

```http
GET /api/grades/student/{student_id}/average
Authorization: Bearer {token}

Response: {
  "student_id": "STU001",
  "average": 87.3,
  "total_courses": 5,
  "gpa": 3.8
}
```

#### Schema SQLAlchemy
```python
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class Grade(Base):
    __tablename__ = "grades"
    
    id = Column(String, primary_key=True)
    student_id = Column(String, nullable=False, index=True)
    course_id = Column(String, nullable=False, index=True)
    grade = Column(Float, nullable=False)
    letter_grade = Column(String(2))
    feedback = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class GradeStatistics(Base):
    __tablename__ = "grade_statistics"
    
    student_id = Column(String, primary_key=True)
    average_grade = Column(Float)
    total_courses = Column(Integer)
    gpa = Column(Float)
    last_updated = Column(DateTime, default=datetime.utcnow)
```

---

### 2.5 Service Facturation (Billing Service)

#### Configuration
```properties
Service Name: billing-service
Technology Stack: Java 21 + Spring Boot + CXF (SOAP)
Port: 8081
Database: MySQL 8.0
WSDL Endpoint: http://localhost:8081/api/services/billing?wsdl
```

#### Architecture SOAP
```
Request → JWT Auth Filter
       → SOAP Handler
       → BillingServiceImpl (Web Service)
       → BillingService (Business Logic)
       → BillingRepository
       → MySQL Database
       → SOAP Response
```

#### Web Service SOAP
```xml
<wsdl:definitions xmlns:tns="http://billing.nexis.com">
  
  <wsdl:types>
    <xsd:schema targetNamespace="http://billing.nexis.com">
      <xsd:element name="Invoice">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="invoiceId" type="xsd:string"/>
            <xsd:element name="studentId" type="xsd:string"/>
            <xsd:element name="amount" type="xsd:decimal"/>
            <xsd:element name="dueDate" type="xsd:date"/>
            <xsd:element name="status" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </wsdl:types>

  <wsdl:message name="GetInvoicesRequest">
    <wsdl:part name="studentId" type="xsd:string"/>
  </wsdl:message>
  <wsdl:message name="GetInvoicesResponse">
    <wsdl:part name="invoices" element="Invoice" maxOccurs="unbounded"/>
  </wsdl:message>

  <wsdl:portType name="BillingServicePort">
    <wsdl:operation name="getInvoices">
      <wsdl:input message="tns:GetInvoicesRequest"/>
      <wsdl:output message="tns:GetInvoicesResponse"/>
    </wsdl:operation>
  </wsdl:portType>

  <wsdl:binding name="BillingServiceBinding">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <wsdl:operation name="getInvoices">
      <soap:operation soapAction="getInvoices"/>
      <wsdl:input><soap:body use="literal"/></wsdl:input>
      <wsdl:output><soap:body use="literal"/></wsdl:output>
    </wsdl:operation>
  </wsdl:binding>
</wsdl:definitions>
```

#### Tables MySQL
```sql
CREATE TABLE invoices (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  issued_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status ENUM('PENDING', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'PENDING',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_student (student_id),
  INDEX idx_status (status)
);

CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  invoice_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('CARD', 'BANK_TRANSFER', 'CHECK', 'CASH'),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reference_number VARCHAR(100),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
```

---

### 2.6 API Gateway

#### Configuration
```properties
Service Name: api-gateway
Technology Stack: Java 21 + Spring Cloud Gateway
Port: 9090
Load Balancing: Round-robin
```

#### Routes Configuration
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://auth-service:8080
          predicates:
            - Path=/auth/**
          filters:
            - RewritePath=/auth(?<segment>/?.*), /auth$\{segment}
        
        - id: student-service
          uri: http://student-service:3000
          predicates:
            - Path=/students/**
          filters:
            - JwtAuthenticationFilter
        
        - id: course-service
          uri: http://course-service:8082
          predicates:
            - Path=/courses/**
        
        - id: grade-service
          uri: http://grade-service:8000
          predicates:
            - Path=/grades/**
          filters:
            - JwtAuthenticationFilter
        
        - id: billing-service
          uri: http://billing-service:8081
          predicates:
            - Path=/billing/**
          filters:
            - JwtAuthenticationFilter
```

#### Fonctionnalités
- Authentification centralisée JWT
- Rate limiting
- Logging des requêtes
- CORS configuration
- Health checks

---

## 3. SÉCURITÉ

### 3.1 JWT Implementation
```
Token Structure: header.payload.signature

Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "STU001",
  "username": "ahmed@university.edu",
  "role": "STUDENT",
  "iat": 1702667400,
  "exp": 1702753800
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### 3.2 Secret Partagé
```
JWT_SECRET=MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters
```

### 3.3 Expiration et Refresh
- **Access Token TTL :** 24 heures
- **Refresh Token TTL :** 7 jours
- **Token Validation :** Avant chaque requête

---

## 4. BASES DE DONNÉES

### 4.1 MySQL (Auth, Course, Billing)
```properties
Host: mysql
Port: 3306
Username: root
Password: root
Databases: auth_db, course_db, billing_db
Backup: Volume Docker mysql_data
```

### 4.2 MongoDB (Student Service)
```properties
Host: mongodb
Port: 27017
Username: admin
Password: pass
Database: student_db
Backup: Volume Docker mongodb_data
```

### 4.3 PostgreSQL (Grade Service)
```properties
Host: postgres
Port: 5432
Username: postgres
Password: postgres
Database: grade_db
Backup: Volume Docker postgres_data
```

---

## 5. DOCKER & DÉPLOIEMENT

### 5.1 Structure Docker Compose
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    ports: ["3306:3306"]
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mysql_data:/var/lib/mysql

  mongodb:
    image: mongo:6.0
    ports: ["27017:27017"]
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: pass
    volumes:
      - mongodb_data:/data/db

  postgres:
    image: postgres:15
    ports: ["5432:5432"]
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Services
  auth-service:
    build: ./services/auth-service
    ports: ["8080:8080"]
    depends_on: [mysql]
    environment:
      JWT_SECRET: MyVerySecureSecretKeyForAuthenticationJWTTokens2024WithEnoughCharacters
    networks: [soa-network]

  student-service:
    build: ./services/student-service
    ports: ["3000:3000"]
    depends_on: [mongodb]
    networks: [soa-network]

  # ... other services

volumes:
  mysql_data:
  mongodb_data:
  postgres_data:

networks:
  soa-network:
    driver: bridge
```

### 5.2 Commandes Docker Compose
```bash
# Démarrer tous les services
docker-compose up -d

# Construire les images
docker-compose build

# Voir les logs
docker-compose logs -f service-name

# Arrêter les services
docker-compose down

# Nettoyer les volumes
docker-compose down -v
```

---

## 6. TESTING

### 6.1 Tests Unitaires
- **Framework :** JUnit 5 (Java), Jest (Node.js), Pytest (Python)
- **Coverage :** > 70%
- **Couverture :** Services, Repositories, Controllers

### 6.2 Tests d'Intégration
- Tests inter-services via API Gateway
- Validation des workflows complets
- Tests de sécurité JWT

### 6.3 Tests de Charge
- Load testing avec Apache JMeter
- Simulation 1000+ requêtes/sec
- Monitoring performance

---

## 7. MONITORING & LOGS

### 7.1 Logs
- **Format :** JSON
- **Niveau :** INFO, WARN, ERROR
- **Agrégation :** Centralisée via Docker

### 7.2 Health Checks
```http
GET http://localhost:8080/actuator/health
GET http://localhost:3000/health
GET http://localhost:8000/health
GET http://localhost:8081/actuator/health
```

---

## 8. DOCUMENTATION API

### 8.1 Swagger/OpenAPI
- Auth Service: http://localhost:8080/swagger-ui.html
- Grade Service: http://localhost:8000/docs
- Student Service: Postman collection

### 8.2 SOAP WSDL
- Course Service: http://localhost:8082/api/ws/course?wsdl
- Billing Service: http://localhost:8081/services/billing?wsdl

---

## 9. FRONTEND REACT

### 9.1 Stack Technique
```
Framework: React 18 + TypeScript
Bundler: Vite 6.x
Styling: TailwindCSS 3.x
UI Components: shadcn/ui (Radix UI)
State Management: React Query (TanStack Query)
Routing: React Router v6
Icons: Lucide React
```

### 9.2 Structure Frontend
```
FrontEnd/
├── src/
│   ├── components/
│   │   ├── ui/              (shadcn components)
│   │   ├── dashboard/       (layout, sidebar)
│   │   └── landing/         (hero, stats, teachers)
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Grades.tsx
│   │   ├── Billing.tsx
│   │   ├── Courses.tsx
│   │   └── Profile.tsx
│   ├── lib/
│   │   └── api.ts           (REST + SOAP calls)
│   └── hooks/
│       └── useAuth.tsx      (JWT management)
└── package.json
```

### 9.3 Appels API
```typescript
// REST Call Example (Grade Service)
const res = await fetch(`http://localhost:8000/api/grades`, {
  headers: { Authorization: `Bearer ${token}` }
});

// SOAP Call Example (Billing Service)
const soapEnvelope = `
<soapenv:Envelope xmlns:bil="http://nexis.com/billing">
  <soapenv:Body>
    <bil:getInvoices><studentId>${id}</studentId></bil:getInvoices>
  </soapenv:Body>
</soapenv:Envelope>`;

await fetch(`http://localhost:8081/services/billing`, {
  method: "POST",
  headers: { "Content-Type": "text/xml" },
  body: soapEnvelope
});
```

### 9.4 Gestion des Rôles
```typescript
const { user } = useAuth();
const isAdmin = user?.role === "ADMIN";

// Affichage conditionnel
{isAdmin ? <AdminDashboard /> : <StudentDashboard />}
```

---

**Version :** 2.0  
**Dernière mise à jour :** 16 Décembre 2024  
**Mise à jour :** Ajout section Frontend React, correction endpoints SOAP
