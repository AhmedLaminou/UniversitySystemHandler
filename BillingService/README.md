# Billing Service (SOAP)

## Overview

The **Billing Service** is a SOAP web service built with **.NET Core** that manages university billing and fees. It integrates with the **Auth Service** for security and uses **MySQL** for data persistence.

## Features

- **SOAP Web Service**: Standards-based SOAP 1.1/1.2 endpoints
- **Bill Management**: Create, retrieve, and pay bills
- **Debt Calculation**: Calculate total unpaid debt per student
- **Secure Operations**: Token-based authentication via Auth Service
- **Role-Based Access**: Admin-only operations for bill creation
- **Database**: MySQL with Entity Framework Core

## Prerequisites

- **.NET 8.0 SDK**
- **MySQL Server** (Local or remote)
- **Auth Service**: Running on `http://localhost:8080`

## Installation

1. **Navigate to the service directory**:

   ```bash
   cd BillingService
   ```

2. **Restore dependencies**:

   ```bash
   dotnet restore
   ```

3. **Update database connection** in `appsettings.json`:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=billing_db;User=root;Password=yourpassword;"
   }
   ```

4. **Apply database migrations**:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
   Or the migrations will be applied automatically on first run.

## Running the Application

```bash
dotnet run
```

The service will start on `http://localhost:5000` (or `https://localhost:5001`).

## SOAP Endpoints

### WSDL

Access the WSDL at: `http://localhost:5000/BillingService.asmx?wsdl`

### Operations

| Operation             | Description                    | Access Level           |
| :-------------------- | :----------------------------- | :--------------------- |
| **CreateBill**        | Create a new bill              | **ADMIN Only**         |
| **GetBillsByStudent** | Get all bills for a student    | **Authenticated User** |
| **GetUnpaidBills**    | Get unpaid bills for a student | **Authenticated User** |
| **PayBill**           | Mark a bill as paid            | **Authenticated User** |
| **GetTotalDebt**      | Calculate total unpaid amount  | **Authenticated User** |

### Sample SOAP Request (CreateBill)

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CreateBillAsync xmlns="http://tempuri.org/">
      <request>
        <Token>YOUR_JWT_TOKEN_HERE</Token>
        <StudentId>S1001</StudentId>
        <Amount>500.00</Amount>
        <Description>Tuition Fee - Semester 1</Description>
        <DueDate>2024-12-31T00:00:00</DueDate>
      </request>
    </CreateBillAsync>
  </soap:Body>
</soap:Envelope>
```

### Sample SOAP Response

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CreateBillAsyncResponse xmlns="http://tempuri.org/">
      <CreateBillAsyncResult>
        <Success>true</Success>
        <Message>Bill created successfully</Message>
        <Bill>
          <Id>1</Id>
          <StudentId>S1001</StudentId>
          <Amount>500.00</Amount>
          <Description>Tuition Fee - Semester 1</Description>
          <DueDate>2024-12-31T00:00:00</DueDate>
          <IsPaid>false</IsPaid>
        </Bill>
      </CreateBillAsyncResult>
    </CreateBillAsyncResponse>
  </soap:Body>
</soap:Envelope>
```

## Architecture & Integration

### Auth Service Integration

All SOAP operations require a JWT token passed in the request. The service validates tokens by calling the Auth Service's `/api/auth/me` endpoint.

**Workflow:**

1. Client sends SOAP request with `Token` field
2. Service extracts token and calls Auth Service
3. If valid, operation proceeds; if invalid, returns error response

### Project Structure

```
BillingService/
├── Models/
│   └── Bill.cs              # Entity model
├── Data/
│   └── BillingDbContext.cs  # EF Core context
├── Services/
│   ├── IAuthService.cs      # Auth interface
│   ├── AuthService.cs       # Auth implementation
│   ├── IBillingService.cs   # SOAP contract
│   └── BillingServiceImpl.cs # SOAP implementation
├── Program.cs               # Application entry
├── appsettings.json         # Configuration
└── BillingService.csproj    # Project file
```

## Testing

### Using SoapUI

1. Import WSDL: `http://localhost:5000/BillingService.asmx?wsdl`
2. Create request from operation
3. Add your JWT token to the `Token` field
4. Execute request

### Using Postman

1. Create new SOAP request
2. Enter WSDL URL
3. Select operation
4. Fill in request parameters
5. Send request

## Database Schema

**Bills Table:**

- `Id` (INT, Primary Key)
- `StudentId` (VARCHAR(50))
- `Amount` (DECIMAL(10,2))
- `Description` (VARCHAR(500))
- `DueDate` (DATETIME)
- `IsPaid` (BOOLEAN)
- `PaymentDate` (DATETIME, nullable)
- `CreatedAt` (DATETIME)
- `UpdatedAt` (DATETIME, nullable)
