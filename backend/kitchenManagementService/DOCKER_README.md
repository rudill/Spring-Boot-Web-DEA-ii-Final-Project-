# Kitchen Management Service - Docker Setup

## 🐳 Containerization Overview

This service is fully containerized using Docker and Docker Compose, including:
- **Kitchen Management Service** (Spring Boot application)
- **MySQL 8.0 Database** (with persistent storage)

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)
- Ports 8083 and 3307 available on your machine

## 🚀 Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configurations (optional - defaults work fine for development)
```

### 2. Build and Run

```bash
# Navigate to the service directory
cd backend/kitchenManagementService

# Build and start all services
docker-compose up -d

# View logs (follow mode)
docker-compose logs -f

# View specific service logs
docker-compose logs -f kitchen-service
docker-compose logs -f kitchen-db
```

### 3. Verify Services

```bash
# Check running containers
docker-compose ps

# Check service health
curl http://localhost:8083/actuator/health

# Test API endpoint
curl http://localhost:8083/api/kitchen/menu-items
```

## 🔧 Management Commands

### Starting Services

```bash
# Start all services
docker-compose up -d

# Start with rebuilding images
docker-compose up -d --build

# Start and view logs
docker-compose up
```

### Stopping Services

```bash
# Stop services (containers remain)
docker-compose stop

# Stop and remove containers (data persists)
docker-compose down

# Stop and remove everything including volumes (⚠️ DATA WILL BE LOST)
docker-compose down -v
```

### Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart kitchen-service
```

### Viewing Logs

```bash
# All services (follow mode)
docker-compose logs -f

# Specific service
docker-compose logs -f kitchen-service

# Last 100 lines
docker-compose logs --tail=100

# Since specific time
docker-compose logs --since 30m
```

### Rebuilding Services

```bash
# Rebuild all services
docker-compose build

# Rebuild and restart
docker-compose up -d --build

# Rebuild without cache
docker-compose build --no-cache
```

## 🗄️ Database Access

### Via Docker Exec (Recommended)

```bash
# Access MySQL shell
docker exec -it kitchen-mysql-db mysql -u kitchen_user -pkitchen_pass kitchen_management_db

# Execute SQL file
docker exec -i kitchen-mysql-db mysql -u kitchen_user -pkitchen_pass kitchen_management_db < backup.sql
```

### Via MySQL Client (if installed locally)

```bash
mysql -h 127.0.0.1 -P 3307 -u kitchen_user -pkitchen_pass kitchen_management_db
```

### Database Backup

```bash
# Backup database
docker exec kitchen-mysql-db mysqldump -u kitchen_user -pkitchen_pass kitchen_management_db > backup.sql

# Restore database
docker exec -i kitchen-mysql-db mysql -u kitchen_user -pkitchen_pass kitchen_management_db < backup.sql
```

## 🌐 Endpoints

- **Service Base URL**: http://localhost:8083
- **Health Check**: http://localhost:8083/actuator/health
- **API Documentation (Swagger)**: http://localhost:8083/swagger-ui.html
- **Database**: localhost:3307 (MySQL)

## 🔍 Troubleshooting

### Service Won't Start

```bash
# Check logs for errors
docker-compose logs kitchen-service

# Check if database is healthy
docker-compose ps
docker exec kitchen-mysql-db mysqladmin ping -u root -proot123
```

### Database Connection Issues

```bash
# Restart database
docker-compose restart kitchen-db

# Wait for database to be healthy
docker-compose ps

# Check database logs
docker-compose logs kitchen-db
```

### Port Conflicts

If ports 8083 or 3307 are already in use, update `.env`:

```env
SERVICE_PORT=8084
DB_PORT=3308
```

### Clean Rebuild (Fresh Start)

```bash
# Stop everything
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild and start
docker-compose up -d --build
```

### View Container Resource Usage

```bash
# View stats
docker stats kitchen-management-service kitchen-mysql-db

# Inspect container
docker inspect kitchen-management-service
```

## 💾 Data Persistence

### Database Data

- **Volume Name**: `kitchen-db-data`
- **Location**: Managed by Docker
- **Persistence**: Data survives container restarts and recreations
- **Removal**: Data is removed only with `docker-compose down -v`

### View Volumes

```bash
# List all volumes
docker volume ls

# Inspect volume
docker volume inspect kitchenmanagementservice_kitchen-db-data

# Remove volume (⚠️ DATA WILL BE LOST)
docker volume rm kitchenmanagementservice_kitchen-db-data
```

### Application Logs

- **Location**: `./logs/kitchen-service.log`
- **Persistence**: Stored on host machine
- **Rotation**: Configure in application.yaml if needed

## ⚙️ Configuration

### Environment Variables (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| MYSQL_ROOT_PASSWORD | root123 | MySQL root password |
| MYSQL_DATABASE | kitchen_management_db | Database name |
| MYSQL_USER | kitchen_user | Database user |
| MYSQL_PASSWORD | kitchen_pass | Database password |
| DB_PORT | 3307 | Database port (host) |
| SERVICE_PORT | 8083 | Service port (host) |
| INVENTORY_SERVICE_URL | http://host.docker.internal:8082 | Inventory service URL |
| SPRING_JPA_DDL_AUTO | update | Hibernate DDL mode |
| SPRING_JPA_SHOW_SQL | true | Show SQL in logs |
| LOG_LEVEL | INFO | Application log level |

### Hibernate DDL Auto Options

- `update` (Development) - Updates schema, preserves data ✅ **Recommended for Docker**
- `create` - Drops and recreates schema on startup ⚠️
- `create-drop` - Drops schema on shutdown ⚠️
- `validate` - Only validates schema
- `none` (Production) - No automatic schema management

## 🔐 Security Considerations (Production)

1. **Change Default Passwords**
   ```env
   MYSQL_ROOT_PASSWORD=<strong-password>
   MYSQL_PASSWORD=<strong-password>
   ```

2. **Use Secrets Management**
   - Docker Secrets
   - Kubernetes Secrets
   - AWS Secrets Manager
   - HashiCorp Vault

3. **Set Appropriate DDL Mode**
   ```env
   SPRING_JPA_DDL_AUTO=validate
   ```

4. **Disable SQL Logging**
   ```env
   SPRING_JPA_SHOW_SQL=false
   LOG_LEVEL=WARN
   ```

5. **Add .env to .gitignore** (already configured)

## 🔗 Connecting to Other Services

### Inventory Service

The service connects to the Inventory Service using the URL configured in `.env`:

```env
INVENTORY_SERVICE_URL=http://host.docker.internal:8082
```

- `host.docker.internal` resolves to the host machine (for local development)
- For Docker network communication, use service name: `http://inventory-service:8082`
- For production, use actual service URL

### Adding to Shared Network

To connect multiple services:

```yaml
networks:
  kitchen-network:
    external: true
    name: hotel-management-network
```

## 📊 Monitoring

### Health Checks

```bash
# Service health
curl http://localhost:8083/actuator/health

# Database health
docker exec kitchen-mysql-db mysqladmin ping -u root -proot123

# Container health status
docker-compose ps
```

### Metrics

```bash
# Application metrics
curl http://localhost:8083/actuator/metrics

# Specific metric
curl http://localhost:8083/actuator/metrics/jvm.memory.used
```

## 🛠️ Development Workflow

### Making Code Changes

```bash
# 1. Edit code in your IDE
# 2. Rebuild and restart service
docker-compose up -d --build kitchen-service

# 3. View logs
docker-compose logs -f kitchen-service
```

### Running Tests

```bash
# Run tests without rebuilding container
./mvnw test

# Or run inside container
docker-compose exec kitchen-service ./mvnw test
```

## 📝 Notes

- Database resets only if `SPRING_JPA_DDL_AUTO=create` or `create-drop`
- With `SPRING_JPA_DDL_AUTO=update`, data persists across restarts ✅
- Logs are stored in `./logs/` directory on host machine
- Initial database scripts in `init-db/` run only on first container creation

## 🆘 Getting Help

### View Container Details

```bash
# Detailed container info
docker inspect kitchen-management-service

# Process list
docker top kitchen-management-service

# Resource usage
docker stats kitchen-management-service
```

### Access Container Shell

```bash
# Access service container
docker exec -it kitchen-management-service sh

# Access database container
docker exec -it kitchen-mysql-db bash
```

### Common Issues

1. **Service unhealthy**: Wait 60 seconds for startup
2. **Port in use**: Change ports in `.env`
3. **Database not ready**: Wait for health check to pass
4. **Connection refused**: Check if containers are on same network

---

**For more information**, see the main project README or contact the development team.
