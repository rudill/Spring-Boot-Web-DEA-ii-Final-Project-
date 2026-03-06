# Reservation Management Service - Complete Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Backend Service](#backend-service)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Development Setup](#development-setup)

---

## 🎯 Overview

The Reservation Management Service is a core component of the Hotel Management System. It manages the full lifecycle of hotel reservations, including managing guest profiles and their booking histories, as well as sending notifications via email.

---

## 🛠 Technology Stack

### Frontend Technologies
| Technology | Purpose |
|------------|---------|
| **React** | Component-based UI Library |
| **Vite** | Build Tool & Dev Server |
| **Axios** | API Interfacing |
| **React Router** | Application Routing |

### Backend Technologies
| Technology | Purpose |
|------------|---------|
| **Java** | 21 |
| **Spring Boot** | Application Framework |
| **Spring Data JPA** | Data Persistence Layer |
| **MySQL** | Primary Database |
| **Hibernate** | ORM Framework |
| **Lombok** | Boilerplate Code Reduction |
| **Spring Mail** | Email Notifications |
| **Maven** | Build Tool |



## 💻 Frontend Application

### Project Structure
The frontend is built using **React** and **Vite**.
```text
frontend/reservation-management/
├── src/                         # Main source code directory
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Application pages/screens
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # Application entry point
├── public/                      # Static assets
├── package.json                 # Dependencies and project definition
└── vite.config.js               # Vite configuration
```

### Key Dependencies (`package.json`)
- **react / react-dom**: Core UI library for building component-centric interfaces
- **vite**: Next-generation frontend tooling for fast development
- **axios**: Promise-based HTTP client for backend API interactions
- **react-router-dom**: Declarative routing for React applications

### UI Features
- Fast module replacement and fast startup thanks to Vite.
- Responsive, component-based user interface.
- Direct connectivity to Sprint Boot backend REST endpoints using Axios.

---

## 🔧 Backend Service

### Project Structure
```
backend/reservationManagementService/
├── src/
│   ├── main/
│   │   ├── java/com/nsbm/group03/reservationManagementService/
│   │   │   ├── controller/                # REST Controllers
│   │   │   │   ├── GuestController.java
│   │   │   │   └── ReservationController.java
│   │   │   ├── dto/                       # Data Transfer Objects
│   │   │   ├── entity/                    # JPA Entities
│   │   │   │   ├── Guest.java
│   │   │   │   └── Reservation.java
│   │   │   ├── repository/                # Data Access Layer
│   │   │   ├── service/                   # Business Logic
│   │   │   └── ReservationManagementServiceApplication.java
│   │   └── resources/
│   │       └── application.properties     # Configuration
│   └── test/                              # Unit Tests
├── pom.xml                                # Maven Dependencies
```

### Key Backend Components

#### 1. Guest Entity (`Guest.java`)
```java
@Entity
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long guestId;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String phoneNumber;
    @Column(unique = true)
    private String nic;
    private String email;
}
```

#### 2. Reservation Entity (`Reservation.java`)
```java
@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;
    @ManyToOne
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;
    private String roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private double totalAmount;
    private String specialRequests;
    private String status;
    private LocalDateTime createdAt;
}
```

#### 3. Constants & Configurations (`application.properties`)
- Configured to use MySQL Database: `ReservationManagementDB`.
- Application runs on **port 8081**.
- Configured to send emails using Gmail's SMTP server `smtp.gmail.com` on port `587`.

### API Endpoints

#### Guest Endpoints (`/api/v1/guest`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getguests` | Get all guests |
| POST | `/saveguest` | Create a new guest |
| GET | `/{id}` | Get guest by ID |
| GET | `/findGuestByNic/{nic}` | Find a guest using their NIC |
| PUT | `/updateguest` | Update guest details |
| DELETE | `/deleteguest` | Delete a guest |

#### Reservation Endpoints (`/api/reservations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all reservations |
| POST | `/` | Create a new reservation |
| GET | `/guest/{guestId}` | Get all reservations for a specific guest |
| PATCH | `/{id}/status?status=...` | Update reservation status |
| DELETE | `/{id}` | Delete a reservation |

---

## ✨ Features

### Operations
✅ **Guest Profile Management**
- Manage personal profiles for hotel guests including their NIC and contact information.
- Quickly find and retrieve guest profiles by NIC.

✅ **Reservation Handling**
- Connect guests to specific rooms spanning a predefined check-in and check-out period.
- Filter past and upcoming reservations for any given guest.
- Change reservation statuses (e.g., Pending, Confirmed, Cancelled).

✅ **Email Notification**
- Utilizes Spring Mail to execute automated notifications over SMTP.
- Enhances guest experience with booking confirmations and status updates.

---

## 🗄 Database Schema

### MySQL Schema

```sql
CREATE TABLE guest (
    guest_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(255) UNIQUE,
    nic VARCHAR(255) UNIQUE,
    email VARCHAR(255)
);

CREATE TABLE reservation (
    reservation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_id BIGINT NOT NULL,
    room_id VARCHAR(255),
    check_in_date DATE,
    check_out_date DATE,
    total_amount DOUBLE,
    special_requests VARCHAR(255),
    status VARCHAR(255),
    created_at DATETIME,
    CONSTRAINT fk_guest FOREIGN KEY (guest_id) REFERENCES guest(guest_id)
);
```

### Properties mapping
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ReservationManagementDB?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=1414
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
server.port=8081
```

---

## 🚀 Deployment

### Frontend Deployment (React + Vite)
```bash
# 1. Navigate to frontend directory
cd frontend/reservation-management

# 2. Install dependencies
npm install

# 3. Build for Production
npm run build
# Output will be located in the dist/ directory
```

### Backend Deployment (Docker & Spring Boot)
The codebase uses Maven for building the project.

#### Using Maven Spring Boot
```bash
# 1. Navigate to backend directory
cd backend/reservationManagementService

# 2. Build via Maven
mvn clean install

# 3. Run application
mvn spring-boot:run
```

---

## 💻 Development Setup

### Frontend Setup
1. Ensure **Node.js** and **npm** are installed.
2. Navigate to `frontend/reservation-management`.
3. Run `npm install` to download required dependencies.
4. Run `npm run dev` to start the Vite development server.
5. Access the application in your browser (usually at `http://localhost:5173`).

### Backend Setup
1. Ensure **Java 21**, **Maven**, and **MySQL** are installed.
2. Clone repository and navigate to `backend/reservationManagementService`.
3. Provide missing email configurations or update existing SMTP passwords inside `application.properties`.
4. Ensure your local MySQL instance is running.
5. Run `mvn spring-boot:run` or execute `ReservationManagementServiceApplication.java` from your Java IDE.

---

**Status**: ✅ Implementation Available  
**Port**: `8081`
