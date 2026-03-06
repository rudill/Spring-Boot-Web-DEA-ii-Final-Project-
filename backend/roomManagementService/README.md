# Room Management Service

## Overview
The Room Management Service is a microservice component of the Hotel Management System (HMS) that provides comprehensive room management functionality. This service handles room inventory, status tracking, availability management, and statistical reporting for hotel operations. It maintains a complete history of room statuses and supports real-time availability queries for different dates.

## System Architecture
This service follows a **microservice architecture** as part of a larger Hotel Management System. It implements a **layered architecture** with clear separation of concerns:

- **Controller Layer**: REST API endpoints with OpenAPI/Swagger documentation
- **Service Layer**: Business logic for room operations and status management
- **Repository Layer**: Data access using Spring Data JPA
- **Entity Layer**: JPA entities representing database tables

The service uses **MySQL** as the primary database and includes Docker containerization for easy deployment.

## Tech Stack
### Backend
- **Framework**: Spring Boot 4.0.3
- **Language**: Java 21
- **Database**: MySQL 8.0+ (with H2 for testing)
- **ORM**: Spring Data JPA with Hibernate
- **API Documentation**: OpenAPI 3.0 with Swagger UI

### Tools & Infrastructure
- **Build Tool**: Maven
- **Containerization**: Docker & Docker Compose
- **Testing**: Spring Boot Test with JUnit
- **Validation**: Jakarta Bean Validation
- **Scheduling**: Spring Scheduling (for automated tasks)

## Project Structure
```
src/main/java/com/nsbm/group03/roomManagementService/
├── Controller/
│   └── RoomController.java          # REST API endpoints
├── Service/
│   ├── RoomService.java            # Business logic for rooms
│   └── RoomTypeService.java        # Business logic for room types
├── Repository/
│   ├── RoomRepository.java         # Room data access
│   ├── RoomStatusHistoryRepository.java  # Status history data access
│   └── RoomTypeRepository.java     # Room type data access
├── Entity/
│   ├── Room.java                   # Room entity
│   ├── RoomStatusHistory.java      # Status history entity
│   └── RoomTypeEntity.java         # Room type entity
├── Dto/                            # Data Transfer Objects
│   ├── RoomDTO.java
│   ├── RoomCreateDTO.java
│   ├── RoomStatusHistoryDTO.java
│   └── StatisticsDTO.java
├── Enum/
│   ├── RoomStatus.java             # AVAILABLE, OCCUPIED, MAINTENANCE
│   └── RoomType.java               # SINGLE, DOUBLE, DELUXE
├── Mapper/
│   └── RoomMapper.java             # Entity-DTO mapping
├── Config/
│   ├── DataInitializer.java        # Database initialization
│   └── OpenApiConfig.java          # Swagger configuration
└── RoomManagementServiceApplication.java
```

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/rooms` | Get all rooms | - | List<RoomDTO> |
| GET | `/api/rooms/count` | Get room count by type | - | RoomCountDTO |
| GET | `/api/rooms/{roomNumber}` | Get room by number | - | RoomDTO |
| POST | `/api/rooms` | Create new room | RoomCreateDTO | RoomDTO |
| DELETE | `/api/rooms/{roomNumber}` | Delete room | - | String |
| PATCH | `/api/rooms/{roomNumber}/status` | Update room status | RoomStatusUpdateDTO | RoomStatusHistoryDTO |
| POST | `/api/rooms/{roomNumber}/check-in` | Check-in room | Query: changedBy | RoomStatusHistoryDTO |
| POST | `/api/rooms/{roomNumber}/check-out` | Check-out room | Query: changedBy | RoomStatusHistoryDTO |
| POST | `/api/rooms/{roomNumber}/maintenance` | Mark room for maintenance | Query: changedBy | RoomStatusHistoryDTO |
| POST | `/api/rooms/{roomNumber}/available-after-maintenance` | Mark room available after maintenance | Query: changedBy | RoomStatusHistoryDTO |
| GET | `/api/rooms/available` | Get available rooms (today) | - | List<RoomAvailabilityDTO> |
| GET | `/api/rooms/available/by-date` | Get available rooms by date | Query: date | List<RoomAvailabilityDTO> |
| GET | `/api/rooms/occupied` | Get occupied rooms (today) | - | List<RoomStatusHistoryDTO> |
| GET | `/api/rooms/occupied/by-date` | Get occupied rooms by date | Query: date | List<RoomStatusHistoryDTO> |
| GET | `/api/rooms/maintenance` | Get maintenance rooms (today) | - | List<RoomStatusHistoryDTO> |
| GET | `/api/rooms/maintenance/by-date` | Get maintenance rooms by date | Query: date | List<RoomStatusHistoryDTO> |
| GET | `/api/rooms/{roomNumber}/status-history` | Get full status history of a room | - | List<RoomStatusHistoryDTO> |
| GET | `/api/rooms/{roomNumber}/status-history/by-date` | Get room status history by date | Query: date | List<RoomStatusHistoryDTO> |
| GET | `/api/rooms/{roomNumber}/status-history/by-date-range` | Get room status history by date range | Query: startDate, endDate | List<RoomStatusHistoryDTO> |
| GET | `/api/rooms/{roomNumber}/latest-status` | Get latest status of a room | - | RoomStatusHistoryDTO |
| GET | `/api/rooms/history/by-date` | Get all rooms status for a specific date | Query: date | List<RoomStatusHistoryDTO> |
| GET | `/api/rooms/room-types/summary` | Get room types summary | - | List<RoomTypeSummaryDTO> |
| GET | `/api/rooms/room-types/{type}/image` | Get room type image | - | byte[] (image) |
| GET | `/api/rooms/statistics` | Get room statistics | - | StatisticsDTO |
| GET | `/api/rooms/statistics/type` | Get room statistics by type | - | StatisticsByTypeDTO |

## Database Design

### Main Entities

#### Room Entity
- **roomId**: UUID (Primary Key)
- **roomNumber**: String (Unique, Not Null)
- **roomType**: Enum (SINGLE, DOUBLE, DELUXE)
- **pricePerNight**: Double
- **capacity**: Integer
- **status**: Enum (AVAILABLE, OCCUPIED, MAINTENANCE)

#### RoomStatusHistory Entity
- **id**: UUID (Primary Key)
- **room**: Many-to-One relationship with Room
- **date**: LocalDate (Not Null)
- **status**: Enum (AVAILABLE, OCCUPIED, MAINTENANCE)
- **changedBy**: String (ADMIN/SYSTEM/MAINTENANCE)
- **changedAt**: LocalDateTime (Not Null)

#### RoomTypeEntity Entity
- **id**: UUID (Primary Key)
- **roomType**: Enum (SINGLE, DOUBLE, DELUXE) - Unique
- **pricePerNight**: Double
- **imagePath**: String

### Relationships
- **Room** has **One-to-Many** relationship with **RoomStatusHistory** (cascade all, orphan removal)
- **RoomStatusHistory** has **Many-to-One** relationship with **Room**
- **RoomTypeEntity** is independent with unique roomType constraint

### ER Diagram Explanation
```
Room (1) ──── (Many) RoomStatusHistory
    │
    └─── belongs to ─── RoomTypeEntity (reference by enum)
```

Each room maintains a complete history of status changes over time, enabling detailed tracking and analytics.

## Application Flow
1. **Client Request** → HTTP request to REST endpoints
2. **Controller Layer** → Validates input and routes to appropriate service methods
3. **Service Layer** → Implements business logic, handles status transitions, and coordinates data operations
4. **Repository Layer** → Executes database queries using Spring Data JPA
5. **Database Layer** → MySQL database stores and retrieves room and history data
6. **Response** → Formatted DTOs returned to client with appropriate HTTP status codes

## Authentication & Authorization
This service currently does not implement authentication or authorization mechanisms. All endpoints are publicly accessible. In a production environment, consider integrating with an authentication service or API gateway.

## Environment Variables
The following environment variables are required for Docker deployment:

```bash
MYSQL_ROOT_PASSWORD=your_mysql_root_password
MYSQL_DATABASE=hms
```

## Installation

### Prerequisites
- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+ (or Docker for containerized database)

### Local Development Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roomManagementService
   ```

2. **Configure Database**
   - Create a MySQL database named `hms`
   - Update `src/main/resources/application.yaml` with your database credentials

3. **Build the project**
   ```bash
   mvn clean compile
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

### Docker Setup
1. **Set environment variables**
   ```bash
   export MYSQL_ROOT_PASSWORD=your_secure_password
   export MYSQL_DATABASE=hms
   ```

2. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## Running the Project
- **Development**: `mvn spring-boot:run`
- **Production**: `java -jar target/roomManagementService-0.0.1-SNAPSHOT.jar`
- **Docker**: `docker-compose up`

The service will start on `http://localhost:8082`

### API Base URL
```
http://localhost:8082/api/rooms
```

### Swagger Documentation
Access the interactive API documentation at:
```
http://localhost:8082/swagger-ui.html
```

## Example API Requests

### Get All Rooms
```bash
curl -X GET http://localhost:8082/api/rooms
```

### Create a New Room
```bash
curl -X POST http://localhost:8082/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "roomNumber": "101",
    "roomType": "SINGLE",
    "pricePerNight": 50.0,
    "capacity": 1
  }'
```

### Check-in a Room
```bash
curl -X POST "http://localhost:8082/api/rooms/101/check-in?changedBy=ADMIN"
```

### Get Room Statistics
```bash
curl -X GET http://localhost:8082/api/rooms/statistics
```

### Get Available Rooms for Tomorrow
```bash
curl -X GET "http://localhost:8082/api/rooms/available/by-date?date=2026-03-07"
```

## Future Improvements
- Implement authentication and authorization
- Add rate limiting and request validation
- Integrate with booking and reservation services
- Add real-time notifications for status changes
- Implement caching for frequently accessed data
- Add comprehensive logging and monitoring
- Create admin dashboard for room management
- Add support for room amenities and features
- Implement bulk operations for room management
- Add data export functionality (CSV/PDF reports)


