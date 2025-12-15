# 💰 Billing Service

Ce microservice gère la facturation et les paiements des étudiants. C'est un service **SOAP** implémenté en **Java** avec **Spring Boot** et **JAX-WS**.

## 🚀 Fonctionnalités

- **Facturation** : Création et gestion des factures (Invoices).
- **Paiements** : Enregistrement des paiements partiels ou complets.
- **Suivi** : Calcul du solde restant (Outstanding Balance).
- **Historique** : Consultation de l'historique des paiements.

## 🛠️ Technologies

- **Langage** : Java 17
- **Framework** : Spring Boot 3.2.0
- **Protocole** : SOAP (JAX-WS)
- **Base de données** : MySQL
- **ORM** : Spring Data JPA (Hibernate)

## ⚙️ Configuration

Configuration via `src/main/resources/application.properties` :

```properties
server.port=8085
spring.datasource.url=jdbc:mysql://localhost:3306/billing_db
spring.datasource.username=billing_user
spring.datasource.password=billing_pass
spring.jpa.hibernate.ddl-auto=update
```

## 📦 Installation et Démarrage

### Prérequis

- JDK 17
- Maven
- MySQL

### Étapes

1.  **Compiler le projet** :

    ```bash
    ./mvnw clean package
    ```

2.  **Démarrer l'application** :
    ```bash
    java -jar target/billing-service-0.0.1-SNAPSHOT.jar
    ```

## 🐳 Docker

```bash
docker build -t billing-service .
docker run -p 8085:8085 billing-service
```

## 🔗 SOAP Endpoints

- **WSDL** : `http://localhost:8085/ws/billing?wsdl`
- **Endpoint** : `http://localhost:8085/ws/billing`

### Opérations Disponibles

- `createInvoice` : Créer une facture.
- `getInvoice` : Récupérer une facture par ID.
- `getStudentInvoices` : Liste des factures d'un étudiant.
- `recordPayment` : Enregistrer un paiement.
- `getOutstandingBalance` : Obtenir le reste à payer.
