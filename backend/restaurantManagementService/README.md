# Restaurant Management Service

This is the Restaurant Management Service for the Hotel Management System. It handles all restaurant-related operations including menu management, orders, tables, and dining services.

## Features

- Menu item management (CRUD operations)
- Order processing and tracking
- Table reservation and management
- Restaurant capacity management
- Integration with Kitchen Management Service
- RESTful API endpoints
- Swagger/OpenAPI documentation

## Technology Stack

- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- H2 Database (development)
- MySQL (production)
- Maven
- Lombok
- SpringDoc OpenAPI

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL (for production)

### Running the Application

#### Using Maven Wrapper (Linux/Mac):
```bash
./mvnw spring-boot:run
```

#### Using Maven Wrapper (Windows):
```cmd
mvnw.cmd spring-boot:run
```

#### Using Maven:
```bash
mvn spring-boot:run
```

The application will start on port **8087** by default.

## API Documentation

Once the application is running, you can access:

- **Swagger UI**: http://localhost:8087/swagger-ui.html
- **API Docs**: http://localhost:8087/v3/api-docs
- **H2 Console**: http://localhost:8087/h2-console (development only)

## Configuration

The application uses YAML configuration files:

- `application.yaml` - Default configuration
- `application-prod.yaml` - Production configuration

### Key Configuration Properties

```yaml
server:
  port: 8087

spring:
  application:
    name: restaurantManagementService
  datasource:
    url: jdbc:h2:mem:restaurantdb
```

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/nsbm/group03/restaurantManagementService/
│   │       ├── controller/       # REST Controllers
│   │       ├── service/          # Business Logic
│   │       ├── repository/       # Data Access Layer
│   │       ├── entity/           # JPA Entities
│   │       ├── dto/              # Data Transfer Objects
│   │       ├── config/           # Configuration Classes
│   │       └── exception/        # Custom Exceptions
│   └── resources/
│       ├── application.yaml
│       └── application-prod.yaml
└── test/
    └── java/
        └── com/nsbm/group03/restaurantManagementService/
```

## Endpoints

### Health Check
- GET `/actuator/health` - Check service health
- GET `/actuator/info` - Service information
- GET `/actuator/metrics` - Service metrics

## Development

### Building the Project

```bash
./mvnw clean package
```

### Running Tests

```bash
./mvnw test
```

## Database

### H2 Database (Development)
- URL: `jdbc:h2:mem:restaurantdb`
- Console: http://localhost:8087/h2-console
- Username: `sa`
- Password: (empty)

### MySQL (Production)
Configure the following environment variables:
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

This project is part of the Hotel Management System.
