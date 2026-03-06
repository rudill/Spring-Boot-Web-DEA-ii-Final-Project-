# Event Management Service - Complete Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Backend Service](#backend-service)
- [Frontend Application](#frontend-application)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Sample Data](#sample-data)
- [Development Setup](#development-setup)
- [Known Limitations](#known-limitations)

---

## 🎯 Overview

The Event Management Service is a full-stack microservice designed for a Hotel Management System. It enables comprehensive event booking and venue management capabilities including event creation, venue directory management, customer bookings, and event status tracking.

### Live Deployment
- **Frontend**: [https://event-management-frontend-mocha.vercel.app](https://event-management-frontend-mocha.vercel.app)
- **Backend**: [http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com](http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com)
- **API Base URL**: `http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com/api/events`
- **Backend Version**: `v1.4-delete-cors-fix`

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

---

## 💻 Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Programming Language |
| Spring Boot | 3.x | Backend Framework |
| H2 Database | In-Memory | Development Database |
| Maven | 3.x | Build Tool |
| AWS Elastic Beanstalk | - | Cloud Hosting |
| Amazon Linux | 2023 v4.9.0 | Server OS |
| Corretto JDK | 21 | Java Runtime |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| Vite | 5.x | Build Tool |
| React Router | 6.x | Client Routing |
| Axios | 1.x | HTTP Client |
| Lucide React | - | Icon Library |
| Vercel | - | Hosting Platform |

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────┐         HTTPS          ┌──────────────────┐
│   Browser   │ ──────────────────────> │  Vercel CDN      │
└─────────────┘                         │  (Frontend)      │
                                        └──────────────────┘
                                               │
                                               │ HTTP Proxy
                                               ▼
                                        ┌──────────────────┐
                                        │ Serverless Proxy │
                                        │  (/api/proxy)    │
                                        └──────────────────┘
                                               │
                                               │ HTTP
                                               ▼
                                        ┌──────────────────┐
                                        │  AWS Elastic     │
                                        │  Beanstalk       │
                                        │  (Spring Boot)   │
                                        └──────────────────┘
                                               │
                                               ▼
                                        ┌──────────────────┐
                                        │  H2 Database     │
                                        │  (In-Memory)     │
                                        └──────────────────┘
```

### Key Design Decisions

1. **HTTPS to HTTP Proxy**: Vercel serverless function acts as a proxy to handle mixed content security issues
2. **Query Parameter Routing**: Proxy uses `?path=` parameter for flexible endpoint routing
3. **H2 In-Memory Database**: Simplified deployment without RDS costs (data resets on redeploy)
4. **CORS Configuration**: Explicitly allows DELETE, PUT, POST methods for full CRUD support
5. **Stateless Authentication**: Simple admin credentials for demonstration purposes

---

## 🔧 Backend Service

### Project Structure
```
backend/eventManagementService/
├── src/main/java/.../eventManagementService/
│   ├── controller/
│   │   └── EventController.java        # REST API endpoints
│   ├── entity/
│   │   ├── Event.java                  # Event entity model
│   │   └── Venue.java                  # Venue entity model
│   ├── repository/
│   │   ├── EventRepository.java        # Event data access
│   │   └── VenueRepository.java        # Venue data access
│   ├── service/
│   │   └── EventService.java           # Business logic
│   └── EventManagementServiceApplication.java
├── src/main/resources/
│   ├── application.properties          # Default config (port 8087)
│   └── application-prod.properties     # Production config (H2, port 5000)
├── Procfile                            # Elastic Beanstalk startup
├── pom.xml                             # Maven dependencies
└── deploy-delete-fix.zip               # Latest deployment package
```

### Configuration Files

**Procfile** (Elastic Beanstalk):
```
web: java -Dspring.profiles.active=prod -Dserver.port=5000 -jar eventManagementService-0.0.1-SNAPSHOT.jar
```

**application-prod.properties**:
```properties
server.port=5000
spring.datasource.url=jdbc:h2:mem:hotel_db
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create
spring.h2.console.enabled=false
```

### CORS Configuration
```java
@CrossOrigin(
    origins = "*",
    methods = {
        RequestMethod.GET, 
        RequestMethod.POST, 
        RequestMethod.PUT, 
        RequestMethod.DELETE, 
        RequestMethod.OPTIONS
    }
)
```

---

## 🎨 Frontend Application

### Project Structure
```
frontend/event-management/
├── api/
│   └── proxy.js                        # Vercel serverless proxy
├── public/
│   └── Hotel_Logo.png                  # Hotel branding
├── src/
│   ├── components/
│   │   ├── Layout.jsx                  # Main layout wrapper
│   │   ├── Sidebar.jsx                 # Navigation sidebar
│   │   └── ProtectedRoute.jsx          # Auth guard
│   ├── context/
│   │   └── AuthContext.jsx             # Authentication state
│   ├── pages/
│   │   ├── Login.jsx                   # Login page
│   │   ├── Dashboard.jsx               # Statistics dashboard
│   │   ├── EventList.jsx               # Event directory
│   │   ├── AddEvent.jsx                # Create event form
│   │   ├── EditEvent.jsx               # Update event form
│   │   ├── EventDetails.jsx            # Event details view
│   │   ├── VenueList.jsx               # Venue directory
│   │   ├── AddVenue.jsx                # Create venue form
│   │   └── EditVenue.jsx               # Update venue form
│   ├── services/
│   │   └── api.js                      # Axios API client
│   ├── App.jsx                         # Root component
│   └── main.jsx                        # Entry point
├── vercel.json                         # Deployment config
├── vite.config.js                      # Build configuration
└── package.json                        # Dependencies
```

### Proxy Implementation

**API Proxy** (`/api/proxy.js`):
```javascript
// Converts HTTPS frontend requests to HTTP backend requests
// Usage: /api/proxy?path=venues/7
const AWS_BACKEND = 'http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com/api/events';

export default async function handler(req, res) {
  const targetPath = req.query.path || '';
  const url = targetPath ? `${AWS_BACKEND}/${targetPath}` : AWS_BACKEND;
  
  // Proxy the request with proper CORS headers
  // Handles GET, POST, PUT, DELETE, OPTIONS
}
```

### API Client Configuration
```javascript
// Production: Routes through proxy with query parameters
// Development: Direct connection to AWS backend
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api/proxy'
  : 'http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com/api/events';
```

---

## ✨ Features

### Venue Management
- ✅ **Create Venue**: Add new event venues with details (name, location, capacity, amenities, pricing)
- ✅ **View Venues**: Browse all available venues in a responsive table
- ✅ **Search Venues**: Filter by venue name or location
- ✅ **Edit Venue**: Update venue information
- ✅ **Delete Venue**: Remove venues with confirmation dialog
- ✅ **Capacity Tracking**: Monitor venue capacity for event planning

### Event Management
- ✅ **Book Events**: Create event bookings with customer details
- ✅ **Event Directory**: View all events with filtering options
- ✅ **Customer Details**: Store customer name, email, phone
- ✅ **Event Types**: Support for weddings, corporate events, birthdays, conferences, anniversaries
- ✅ **Status Tracking**: Monitor event status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- ✅ **Special Requirements**: Document specific event needs
- ✅ **Edit Events**: Update event details
- ✅ **Delete Events**: Cancel events with confirmation
- ✅ **Cost Calculation**: Track total booking costs

### Dashboard & Analytics
- 📊 **Total Events**: Real-time event count
- 🏢 **Total Venues**: Available venues count
- 👥 **Total Attendees**: Aggregate attendee tracking
- 📈 **Statistics Cards**: Visual metrics display

### User Experience
- 🔐 **Authentication**: Simple admin login system
- 🎨 **Modern UI**: Clean, responsive design with blue theme
- 🔍 **Search & Filter**: Quick data filtering
- ⚡ **Real-time Updates**: Immediate UI updates after actions
- ✅ **Success Messages**: Green confirmation alerts
- ❌ **Error Handling**: User-friendly error messages
- 🔄 **Auto-refresh**: Data reloads after modifications

---

## 📡 API Documentation

### Base URL
```
http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com/api/events
```

### Venue Endpoints

#### Get All Venues
```http
GET /venues
Response: 200 OK
[
  {
    "id": 1,
    "name": "Galle Face Hotel Grand Ballroom",
    "location": "Colombo",
    "capacity": 500,
    "amenities": "Audio/Visual, Stage, Catering, WiFi, AC",
    "pricePerHour": 50000,
    "createdAt": "2026-03-05T00:00:00"
  }
]
```

#### Get Venue by ID
```http
GET /venues/{id}
Response: 200 OK / 404 Not Found
```

#### Create Venue
```http
POST /venues
Content-Type: application/json

{
  "name": "Grand Ballroom",
  "location": "Colombo",
  "capacity": 300,
  "amenities": "Projector, Sound System",
  "pricePerHour": 35000
}

Response: 200 OK - Created venue object
```

#### Update Venue
```http
PUT /venues/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "location": "New Location",
  "capacity": 400,
  "amenities": "Updated amenities",
  "pricePerHour": 40000
}

Response: 200 OK / 404 Not Found
```

#### Delete Venue
```http
DELETE /venues/{id}
Response: 204 No Content / 404 Not Found
```

### Event Endpoints

#### Get All Events
```http
GET /
Response: 200 OK
[
  {
    "id": 1,
    "customerName": "Samantha Perera",
    "customerEmail": "samantha.p@email.com",
    "customerPhone": "+94771234567",
    "venueId": 1,
    "eventDate": "2026-04-15T18:00:00",
    "attendees": 200,
    "eventType": "Wedding",
    "specialRequirements": "Traditional decorations",
    "totalCost": 150000,
    "status": "CONFIRMED",
    "createdAt": "2026-03-05T00:00:00"
  }
]
```

#### Get Event by ID
```http
GET /{id}
Response: 200 OK / 404 Not Found
```

#### Book Event
```http
POST /book
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@email.com",
  "customerPhone": "+94771234567",
  "venueId": 2,
  "eventDate": "2026-05-20T18:00:00",
  "attendees": 150,
  "eventType": "Birthday",
  "specialRequirements": "DJ and cake table",
  "totalCost": 75000,
  "status": "PENDING"
}

Response: 200 OK - Created event object
```

#### Update Event
```http
PUT /{id}
Content-Type: application/json

{
  "customerName": "Updated Name",
  "status": "CONFIRMED",
  ...
}

Response: 200 OK / 404 Not Found
```

#### Delete Event
```http
DELETE /{id}
Response: 204 No Content / 404 Not Found
```

---

## 🗄️ Database Schema

### Venue Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Venue name |
| location | VARCHAR(255) | NOT NULL | Physical location |
| capacity | INTEGER | NOT NULL | Maximum attendees |
| amenities | TEXT | - | Available facilities |
| price_per_hour | DECIMAL(10,2) | NOT NULL | Hourly rental rate |
| created_at | TIMESTAMP | NOT NULL | Record creation time |

### Event Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| customer_name | VARCHAR(255) | NOT NULL | Customer full name |
| customer_email | VARCHAR(255) | NOT NULL | Contact email |
| customer_phone | VARCHAR(20) | NOT NULL | Contact phone |
| venue_id | BIGINT | FOREIGN KEY → venues(id) | Booked venue |
| event_date | TIMESTAMP | NOT NULL | Event date/time |
| attendees | INTEGER | NOT NULL | Expected guest count |
| event_type | VARCHAR(50) | NOT NULL | Event category |
| special_requirements | TEXT | - | Custom requests |
| total_cost | DECIMAL(10,2) | NOT NULL | Total booking cost |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | Booking status |
| created_at | TIMESTAMP | NOT NULL | Record creation time |

### Status Enum Values
- `PENDING` - Awaiting confirmation
- `CONFIRMED` - Booking confirmed
- `COMPLETED` - Event finished
- `CANCELLED` - Booking cancelled

---

## 🚀 Deployment

### Backend Deployment (AWS Elastic Beanstalk)

#### Prerequisites
- AWS Account with Elastic Beanstalk access
- AWS CLI configured
- Java 21 installed
- Maven installed

#### Deployment Steps

1. **Build the Application**
```bash
cd backend/eventManagementService
./mvnw clean package -DskipTests
```

2. **Create Deployment Package**
```bash
# Package the JAR with Procfile and config
zip deploy-delete-fix.zip \
  target/eventManagementService-0.0.1-SNAPSHOT.jar \
  Procfile \
  src/main/resources/application-prod.properties
```

3. **Deploy to Elastic Beanstalk**
   - Go to [AWS Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk)
   - Select `Event-management-service-env`
   - Click **Upload and deploy**
   - Upload `deploy-delete-fix.zip`
   - Version label: `v1.4-delete-cors-fix`
   - Click **Deploy**
   - Wait 3-5 minutes for deployment

4. **Verify Deployment**
```bash
curl http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com/actuator/health
# Response: {"status":"UP"}
```

#### Environment Configuration
- **Platform**: Corretto 21 running on 64bit Amazon Linux 2023/4.9.0
- **Instance Type**: t2.micro (free tier eligible)
- **Port**: 5000 (Elastic Beanstalk requirement)
- **Health Check**: `/actuator/health`

### Frontend Deployment (Vercel)

#### Prerequisites
- Vercel account
- GitHub repository
- Node.js 18+ installed

#### Deployment Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New Project**
   - Import from GitHub: `event-management-frontend`
   - Framework Preset: **Vite**

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy**
   - Click **Deploy**
   - Deployment URL: `https://event-management-frontend-mocha.vercel.app`

4. **Auto-Deploy Setup**
   - Every push to `main` branch triggers automatic deployment
   - Build logs available in Vercel dashboard
   - Typical deployment time: 1-2 minutes

#### Vercel Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## 📊 Sample Data

### Pre-loaded Venues
1. **Galle Face Hotel Grand Ballroom**
   - Location: Colombo
   - Capacity: 500
   - Price: Rs. 50,000/hour
   - Amenities: Audio/Visual, Stage, Catering, WiFi, AC

2. **Cinnamon Grand Colombo**
   - Location: Colombo
   - Capacity: 300
   - Price: Rs. 35,000/hour
   - Amenities: Projector, Sound System, Catering, Parking

3. **Kings Court Kandy**
   - Location: Kandy
   - Capacity: 200
   - Price: Rs. 25,000/hour
   - Amenities: Garden Area, Catering, Parking, AC

4. **Hilton Residences Colombo**
   - Location: Colombo
   - Capacity: 400
   - Price: Rs. 45,000/hour
   - Amenities: LED Screens, Premium Catering, Valet Parking

5. **Jetwing Blue Negombo**
   - Location: Negombo
   - Capacity: 150
   - Price: Rs. 20,000/hour
   - Amenities: Beach View, BBQ Area, Sound System

### Pre-loaded Events
1. **Samantha Perera - Wedding**
   - Venue: Galle Face Hotel
   - Date: April 15, 2026
   - Attendees: 200
   - Status: CONFIRMED
   - Cost: Rs. 150,000

2. **Rajiv Fernando - Corporate Event**
   - Venue: Cinnamon Grand
   - Date: March 25, 2026
   - Attendees: 50
   - Status: CONFIRMED
   - Cost: Rs. 75,000

3. **Nimalka Silva - Birthday Party**
   - Venue: Kings Court Kandy
   - Date: May 10, 2026
   - Attendees: 150
   - Status: PENDING
   - Cost: Rs. 80,000

4. **Ashen Wickramasinghe - Conference**
   - Venue: Hilton Residences
   - Date: March 20, 2026
   - Attendees: 300
   - Status: CONFIRMED
   - Cost: Rs. 200,000

5. **Dilini Jayawardena - Anniversary**
   - Venue: Jetwing Blue
   - Date: June 5, 2026
   - Attendees: 100
   - Status: PENDING
   - Cost: Rs. 65,000

---

## 🛠️ Development Setup

### Backend Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd backend/eventManagementService
```

2. **Install Dependencies**
```bash
./mvnw clean install
```

3. **Run Locally**
```bash
./mvnw spring-boot:run
```

4. **Access**
- API: `http://localhost:8087/api/events`
- H2 Console: `http://localhost:8087/h2-console`
  - JDBC URL: `jdbc:h2:mem:hotel_db`
  - Username: `sa`
  - Password: (empty)

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd frontend/event-management
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Access**
- Local URL: `http://localhost:5173`
- Login with: `admin` / `admin123`

### Testing Deployments

**Test Backend**:
```bash
# Health check
curl http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com/actuator/health

# Get venues
curl http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com/api/events/venues

# Get events
curl http://event-management-service-env.eba-qrma82w3.us-east-1.elasticbeanstalk.com/api/events
```

**Test Frontend**:
- Open: https://event-management-frontend-mocha.vercel.app
- Login with admin credentials
- Test CRUD operations on venues and events

---

## ⚠️ Known Limitations

### Database Limitations
1. **H2 In-Memory Database**
   - Data is lost on server restart or redeployment
   - Not suitable for production with persistent data requirements
   - **Solution**: Migrate to AWS RDS (MySQL/PostgreSQL) for persistence

### Security Considerations
2. **Hardcoded Credentials**
   - Default admin credentials are static
   - No password hashing currently implemented
   - **Solution**: Implement proper authentication (JWT, OAuth2)

3. **CORS Configuration**
   - Currently allows all origins (`*`)
   - Not recommended for production
   - **Solution**: Restrict to specific frontend domain

### Architecture Limitations
4. **HTTPS to HTTP Proxy**
   - Additional latency due to proxy layer
   - Potential single point of failure
   - **Solution**: Deploy backend with HTTPS (AWS Certificate Manager + ALB)

5. **No Data Validation**
   - Limited server-side validation on some fields
   - Relies heavily on client-side validation
   - **Solution**: Add comprehensive Bean Validation annotations

### Scalability
6. **Single Instance**
   - Backend runs on single t2.micro instance
   - No load balancing or auto-scaling
   - **Solution**: Configure Elastic Beanstalk auto-scaling

---

## 📝 Troubleshooting

### Common Issues

#### 404 Errors on Frontend
- **Cause**: Vercel deployment not complete or proxy routing issue
- **Solution**: Wait 2-3 minutes after push, check Vercel deployment logs

#### 405 Method Not Allowed on DELETE
- **Cause**: CORS not allowing DELETE method
- **Solution**: Ensure backend version is v1.4-delete-cors-fix or later

#### Empty Data After Redeploy
- **Cause**: H2 database resets on every deployment
- **Solution**: Re-run data population scripts or migrate to RDS

#### Slow Response Times
- **Cause**: Cold start on AWS Elastic Beanstalk or Vercel serverless
- **Solution**: First request may take 3-5 seconds, subsequent requests are faster

---

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- ✅ Microservices architecture
- ✅ RESTful API design
- ✅ Cloud deployment (AWS, Vercel)
- ✅ Full-stack development (Spring Boot + React)
- ✅ Database management (JPA/Hibernate)
- ✅ DevOps practices (CI/CD with GitHub + Vercel)
- ✅ Problem-solving (CORS, proxy, routing issues)
- ✅ Security considerations (CORS, authentication)

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review API documentation
3. Verify deployment status on AWS/Vercel dashboards
4. Check browser console for client-side errors

---

## 🎉 Conclusion

The Event Management Service successfully demonstrates a production-ready microservice with clean architecture, modern tech stack, and cloud deployment. While it has some limitations (H2 database, basic auth), it provides a solid foundation for further enhancement and serves as an excellent learning project for full-stack cloud development.

**Live Demo**: [https://event-management-frontend-mocha.vercel.app](https://event-management-frontend-mocha.vercel.app)

---

*Last Updated: March 5, 2026*  
*Version: 1.4 (delete-cors-fix)*  
*Status: Production Deployed ✅*
