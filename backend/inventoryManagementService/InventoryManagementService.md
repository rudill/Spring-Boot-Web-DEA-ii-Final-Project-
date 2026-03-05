# Inventory Management Service - Complete Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Backend Service](#backend-service)
- [Frontend Application](#frontend-application)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Deployment](#deployment)
- [Development Setup](#development-setup)

---

## 🎯 Overview

The Inventory Management Service is a comprehensive microservice designed for a Hotel Management System. It handles the complete lifecycle of inventory tracking, restock management, consumption monitoring, and stock alerts.

### Live Deployment

- **Frontend**: `https://inventory-service-70b6b.web.app`
- **Backend**: `https://inventorymanagementservice-inventory.onrender.com`
- **API Swagger**: `https://inventorymanagementservice-inventory.onrender.com/swagger-ui.html`

---

## 🛠 Technology Stack

### Backend Technologies
| Technology | Purpose |
|------------|---------|
| **Java** | 21 |
| **Spring Boot** | Application Framework |
| **Spring Data JPA** | Data Persistence Layer |
| **PostgreSQL & H2** | Primary and Embedded Databases |
| **Hibernate** | ORM Framework |
| **Lombok** | Boilerplate Code Reduction |
| **SpringDoc OpenAPI** | API Documentation |
| **Spring Actuator** | Health Monitoring |
| **Maven** | Build Tool |

### Frontend Technologies
| Technology | Purpose |
|------------|---------|
| **Flutter** | Mobile & Web UI Framework (SDK ^3.10.7) |
| **Dart** | Programming Language |
| **Dio** | HTTP Client |
| **Material & Cupertino Icons** | UI Styling and Icons |

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Application (Flutter)                 │
│                 (Web / Android / iOS / Desktop)              │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS via Dio
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot Backend Service                    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐      │
│  │  OpenAPI     │  │ Controllers  │  │   Services  │      │
│  │ Swagger UI   │→ │   REST API   │→ │   Business  │      │
│  └──────────────┘  └──────────────┘  └─────────────┘      │
│                                              ↓               │
│                                      ┌─────────────┐        │
│                                      │ Repositories│        │
│                                      └──────┬──────┘        │
│                                             ↓               │
│                                      ┌─────────────┐        │
│                                      │ PostgreSQL/ │        │
│                                      │ H2 Database │        │
│                                      └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend Service

### Project Structure
```
backend/inventoryManagementService/
├── src/
│   ├── main/
│   │   ├── java/com/nsbm/group03/inventoryManagementService/
│   │   │   ├── config/                    # Configuration classes
│   │   │   ├── controller/                # REST Controllers
│   │   │   │   └── InventoryController.java
│   │   │   ├── dto/                       # Data Transfer Objects
│   │   │   │   └── InventoryItemDTO.java
│   │   │   ├── entity/                    # JPA Entities
│   │   │   │   └── InventoryItem.java
│   │   │   ├── repository/                # Data Access Layer
│   │   │   ├── service/                   # Business Logic
│   │   │   └── InventoryManagementServiceApplication.java
│   │   └── resources/
│   │       └── application.properties     # Configuration
│   └── test/                              # Unit Tests
├── pom.xml                                # Maven Dependencies
├── Dockerfile                             # Docker Configuration
└── docker-compose.yml                     # Docker Compose Setup
```

### Key Backend Components

#### 1. Inventory Item Entity (`InventoryItem.java`)
```java
@Entity
@Data
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String category;
    private int quantity;
    private int lowStock; // Threshold for low stock alert
}
```

#### 2. Inventory Item DTO (`InventoryItemDTO.java`)
Data Transfer Object encapsulating item properties, representing the same fields as the entity to decouple the database from consumer formats.

#### 3. Constants & Configurations (`application.properties`)
- Configured to use PostgreSQL by default (`org.postgresql.Driver`).
- Uses environment variables for database URLs and credentials.
- Application runs on **port 8087**.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get all inventory items |
| POST | `/api/inventory` | Create new inventory item |
| GET | `/api/inventory/{id}` | Get inventory item by ID |
| PUT | `/api/inventory/{id}` | Update inventory item |
| DELETE | `/api/inventory/{id}` | Delete inventory item |
| PUT | `/api/inventory/{id}/consume` | Consume/Use stock (requires `amountUsed`) |
| PUT | `/api/inventory/{id}/restock` | Add stock (requires `amount`) |
| GET | `/api/inventory/low-stock` | Get items below their low stock threshold |
| GET | `/api/inventory/search` | Search items by keyword (`?keyword=X`) |

---

## 💻 Frontend Application

### Project Structure
The frontend is built using **Flutter**.
```
frontend/inventory_management/
├── lib/                         # Main source code directory
│   ├── main.dart                # Application entry point
│   └── ...                      # Screens, Services, Widgets, Models
├── pubspec.yaml                 # Dependencies and project definition
├── android/                     # Android specific files
├── ios/                         # iOS specific files
├── web/                         # Web specific files
├── linux/                       # Linux specific files
├── macos/                       # macOS specific files
└── windows/                     # Windows specific files
```

### Key Dependencies (`pubspec.yaml`)
- **flutter**: Core UI framework
- **dio**: Advanced HTTP client for API interactions
- **cupertino_icons**: iOS-style UI icons

### UI Features
- Cross-platform support (Android, iOS, Web, Desktop) out-of-the-box thanks to Flutter.
- Intuitive lists to manage, search, and view inventory levels.
- Direct connectivity to backend REST endpoints via Dio.

---

## ✨ Features

### Operations
✅ **CRUD Operations**
- Add new inventory items.
- Read and view details of items in stock.
- Update quantities, names, thresholds, and categories.
- Delete outdated or non-existent items.

✅ **Stock Management**
- Consume items to deduct stock using a specialized API (`/consume`).
- Restock items to increase quantities (`/restock`).
- Manage low stock alerts using a dynamically set threshold (`lowStock`).

✅ **Search & Filters**
- Fetch only low stock items via a dedicated query (`/low-stock`).
- Key-word search to quickly locate specific assets.

---

## 📚 API Documentation

### Interactive Swagger UI
If enabled via `springdoc-openapi-starter-webmvc-ui`, you can access detailed endpoint testing at:
`https://inventorymanagementservice-inventory.onrender.com/swagger-ui.html` or `https://inventorymanagementservice-inventory.onrender.com/swagger-ui/index.html`

### Sample Request
#### Create Inventory Item
```bash
curl -X POST https://inventorymanagementservice-inventory.onrender.com/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Towels",
    "category": "Housekeeping",
    "quantity": 100,
    "lowStock": 20
  }'
```

---

## 🗄 Database Schema

### Inventory Table (PostgreSQL / H2)
```sql
CREATE TABLE inventory_item (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(255),
    quantity INT,
    low_stock INT
);
```

### Properties mapping
```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO}
server.port=8087
```

---

## 🔒 Security
- Application uses configuration properties and environment variables to securely load database credentials without hardcoding them in the repository.
- General access controls and token validation mechanisms are managed by an overriding framework gateway or implemented selectively per system integration.

---

## 🚀 Deployment

### Backend Deployment (Docker & Spring Boot)
The provided codebase includes a `Dockerfile` and `docker-compose.yml`.

#### Using Docker Compose
```bash
# 1. Navigate to backend directory
cd backend/inventoryManagementService

# 2. Build and start via Docker Compose
docker-compose up -d --build

# 3. Check logs
docker-compose logs -f
```

### Frontend Deployment (Flutter)
```bash
# 1. Navigate to frontend directory
cd frontend/inventory_management

# 2. Get dependencies
flutter pub get

# 3. Run application (Select target device in IDE or via CLI)
flutter run -d chrome

# 4. Build for Web Production
flutter build web
# Output will be located in build/web/
```

---

## 💻 Development Setup

### Backend Setup
1. Ensure **Java 21**, **Maven**, and **PostgreSQL** are installed.
2. Clone repository and navigate to `backend/inventoryManagementService`.
3. Provide missing environment variables (e.g., `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`), or configure `application.properties` directly for local testing.
4. Run `mvn spring-boot:run` or execute `InventoryManagementServiceApplication.java` from your Java IDE.

### Frontend Setup
1. Download from [flutter.dev](https://flutter.dev/docs/get-started/install).
2. Install **Flutter** SDK locally and ensure it is added to your PATH.
3. Run `flutter doctor` to ensure no missing dependencies.
4. Navigate to `frontend/inventory_management`.
5. Run `flutter pub get`.
6. Run `flutter run`.

---

**Last Updated**: March 2026  
**Status**: ✅ Implementation Available  
**Port**: `8087`
