# AWS Deployment Guide for Event Management Backend

## 🚀 Complete Step-by-Step Guide for Beginners

---

## **PART 1: AWS Account Setup (15 minutes)**

### Step 1: Create AWS Account

1. **Go to AWS Website**
   - Visit: https://aws.amazon.com/
   - Click "Create an AWS Account" (orange button, top right)

2. **Fill Account Details**
   - Email address: Your email
   - Password: Create strong password
   - AWS account name: `EventManagementSystem` or your name
   - Click "Continue"

3. **Contact Information**
   - Account type: Choose "Personal" 
   - Full name: Your name
   - Phone number: Your mobile number
   - Country: Sri Lanka
   - Address: Your address
   - Click "Create Account and Continue"

4. **Payment Information**
   - Enter credit/debit card details
   - ⚠️ **Don't worry**: AWS Free Tier gives you 750 hours/month free for 12 months
   - AWS will charge Rs. 1-2 for verification (refunded immediately)
   - Click "Verify and Continue"

5. **Identity Verification**
   - Choose phone verification
   - Enter the code you receive via SMS
   - Click "Continue"

6. **Choose Support Plan**
   - Select "Basic support - Free"
   - Click "Complete sign up"

7. **Wait for Confirmation**
   - You'll receive confirmation email (1-5 minutes)
   - Click link in email to activate

### Step 2: Sign In to AWS Console

1. Go to: https://console.aws.amazon.com/
2. Click "Sign in to the Console"
3. Enter email and password
4. You're now in AWS Console! 🎉

---

## **PART 2: Choose Deployment Method**

### 🟢 **OPTION A: AWS Elastic Beanstalk** (Recommended for Beginners)
- ✅ **Easiest** - Automated deployment
- ✅ Perfect for Spring Boot applications
- ✅ Free Tier eligible
- ✅ Auto-scaling and load balancing
- ✅ Built-in monitoring

### 🟡 **OPTION B: AWS EC2** (More Control)
- Requires manual server setup
- More flexibility but complex
- Good for learning AWS deeply

**We'll use Elastic Beanstalk (Option A)** ✨

---

## **PART 3: Prepare Your Backend for AWS**

### Step 1: Update Application Properties

Your backend needs to work in both local and cloud environments.

**File:** `backend/eventManagementService/src/main/resources/application.properties`

```properties
# Application Name
spring.application.name=event-management-service

# Server Port
server.port=5000

# Database Configuration - AWS RDS or H2
# For initial deployment, we'll use H2 (in-memory database)
spring.datasource.url=jdbc:h2:mem:eventdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# H2 Console (disable in production for security)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# CORS Configuration - Update with your frontend URLs
spring.web.cors.allowed-origins=http://localhost:5173,http://localhost:5174,https://your-frontend-url.vercel.app
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*

# Swagger/OpenAPI
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true

# Actuator for Health Checks (AWS needs this)
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when-authorized
```

### Step 2: Create Procfile for Elastic Beanstalk

Already exists, but verify it has:

**File:** `backend/eventManagementService/Procfile`
```
web: java -jar target/eventManagementService-0.0.1-SNAPSHOT.jar
```

### Step 3: Update CORS in EventController

**File:** `backend/eventManagementService/.../controller/EventController.java`

Add your AWS URL once deployed:
```java
@CrossOrigin(origins = { 
    "http://localhost:3000", 
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://your-frontend-url.vercel.app",
    "https://*.elasticbeanstalk.com"
})
```

---

## **PART 4: Build Your Application**

### Step 1: Build JAR File

Open PowerShell in your project root:

```powershell
# Navigate to backend service
cd backend/eventManagementService

# Clean and build
./mvnw clean package -DskipTests

# Verify JAR created
ls target/*.jar
```

You should see: `eventManagementService-0.0.1-SNAPSHOT.jar` (approximately 40-60 MB)

---

## **PART 5: Deploy to AWS Elastic Beanstalk**

### Method 1: Using AWS Console (Web Interface) - EASIEST

#### Step 1: Access Elastic Beanstalk

1. Sign in to AWS Console: https://console.aws.amazon.com/
2. In search bar (top), type "Elastic Beanstalk"
3. Click "Elastic Beanstalk" service

#### Step 2: Create New Application

1. Click **"Create Application"** (orange button)

2. **Application Information:**
   - Application name: `event-management-service`
   - Description: `Hotel Event Management Backend API`
   - Tags: Leave empty or add `Project: HotelManagement`

3. **Platform:**
   - Platform: **Java**
   - Platform branch: **Corretto 21** (matches your Java version)
   - Platform version: (Use recommended version)

4. **Application Code:**
   - Select: **"Upload your code"**
   - Version label: `v1.0-initial`
   - Click "Choose file"
   - Upload: `backend/eventManagementService/target/eventManagementService-0.0.1-SNAPSHOT.jar`
   - ⏳ Wait for upload (2-3 minutes for 40-60 MB file)

5. **Presets:**
   - Select: **"Single instance (free tier eligible)"** ✅
   - This saves costs and works perfectly for testing

6. **Click "Next"**

#### Step 3: Configure Service Access

1. **Service Role:**
   - Select: **"Create and use new service role"**
   - Role name: (auto-generated) `aws-elasticbeanstalk-service-role`

2. **EC2 Instance Profile:**
   - Select: **"Create and use new EC2 instance profile"**
   - Profile name: (auto-generated) `aws-elasticbeanstalk-ec2-role`

3. **Click "Skip to Review"** (we'll keep other settings default)

#### Step 4: Review and Launch

1. Review all settings
2. Click **"Submit"** (orange button)
3. ⏳ **Wait 5-10 minutes** for deployment

You'll see:
- Creating environment... ⏳
- Launching environment... ⏳
- Updating environment... ⏳
- Environment health check... ⏳
- **Health: OK** ✅ (Green checkmark)

#### Step 5: Get Your API URL

1. Once deployed, you'll see:
   - Environment name: `event-management-service-env`
   - URL: `http://event-management-service-env.eba-xxxxxxxx.region.elasticbeanstalk.com`
   
2. **Copy this URL** - This is your backend API URL! 🎉

3. Test it:
   - Open: `http://your-url.elasticbeanstalk.com/swagger-ui.html`
   - You should see Swagger API documentation

---

## **PART 6: Configure Environment Variables (Optional)**

If you need to add configuration:

1. In Elastic Beanstalk console
2. Click your environment name
3. Left menu: **"Configuration"**
4. Category: **"Software"** → Click "Edit"
5. Scroll to **"Environment properties"**
6. Add properties:
   - `SERVER_PORT` = `5000`
   - `SPRING_PROFILES_ACTIVE` = `production`
7. Click "Apply"
8. Wait for environment update (2-3 minutes)

---

## **PART 7: Update Frontend to Use AWS Backend**

### Update API Base URL

**File:** `frontend/event-management/src/services/api.js`

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-aws-url.elasticbeanstalk.com/api/events'  // AWS URL
  : 'http://localhost:8087/api/events';  // Local development
```

Or use environment variables:

**File:** `frontend/event-management/.env`
```
VITE_API_URL=https://your-aws-url.elasticbeanstalk.com/api/events
```

**File:** `frontend/event-management/src/services/api.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8087/api/events';
```

---

## **PART 8: Test Your Deployed Backend**

### 1. Health Check
```
http://your-url.elasticbeanstalk.com/actuator/health
```
Should return: `{"status":"UP"}`

### 2. Swagger UI
```
http://your-url.elasticbeanstalk.com/swagger-ui.html
```
Should show your API documentation

### 3. Get All Venues
```
http://your-url.elasticbeanstalk.com/api/events/venues
```
Should return empty array `[]` or your venues

### 4. Test with PowerShell

```powershell
# Replace with your actual URL
$url = "http://your-url.elasticbeanstalk.com"

# Test health
Invoke-RestMethod -Uri "$url/actuator/health"

# Test venues API
Invoke-RestMethod -Uri "$url/api/events/venues"

# Add a test venue
$venue = @{
    name = "Test Venue"
    capacity = 100
    pricePerHour = 50000
} | ConvertTo-Json

Invoke-RestMethod -Uri "$url/api/events/venues" -Method Post -Body $venue -ContentType "application/json"
```

---

## **PART 9: Costs and Free Tier**

### ✅ AWS Free Tier (First 12 Months)

**Elastic Beanstalk:**
- Free service (you only pay for underlying resources)

**EC2 Instance (t2.micro or t3.micro):**
- 750 hours/month FREE (runs 24/7 for whole month)
- 1 instance free

**Data Transfer:**
- 15 GB outbound free per month
- All inbound data transfer free

**Total Cost:** $0/month if within free tier limits! 🎉

### ⚠️ Cost Management Tips

1. **Use Single Instance** (not load balanced)
2. **Stop environment** when not testing: 
   - Go to environment → Actions → Stop
   - Restart when needed
3. **Terminate when done:**
   - Actions → Terminate environment
4. **Set up billing alerts:**
   - Go to AWS Billing Dashboard
   - Set alert for > $1

---

## **PART 10: Monitoring and Logs**

### View Application Logs

1. Go to Elastic Beanstalk console
2. Click your environment
3. Left menu: **"Logs"**
4. Click **"Request Logs"** → "Last 100 Lines"
5. Download and view logs

### View Environment Health

1. Dashboard shows health: Green (OK), Yellow (Warning), Red (Error)
2. Click "Causes" to see issues
3. Check "Monitoring" tab for CPU, Memory, Network usage

---

## **PART 11: Common Issues and Solutions**

### Issue 1: "502 Bad Gateway"
**Cause:** Application not starting on port 5000
**Solution:** 
- Check application.properties has `server.port=5000`
- Check logs for startup errors

### Issue 2: "Application Not Responding"
**Cause:** Health check failing
**Solution:**
- Add health endpoint: `/actuator/health`
- Configure health check path in environment settings

### Issue 3: "CORS Error"
**Cause:** Frontend can't access backend
**Solution:**
- Update CORS origins in EventController.java
- Add your frontend URL to allowed origins

### Issue 4: "Out of Memory"
**Cause:** t2.micro has limited RAM
**Solution:**
- Add environment property: `JAVA_OPTS=-Xmx512m`
- Or upgrade to t2.small (costs money)

---

## **PART 12: Update Deployment**

### Deploy New Version

1. Build new JAR: `./mvnw clean package -DskipTests`
2. Go to Elastic Beanstalk console
3. Click **"Upload and deploy"**
4. Choose new JAR file
5. Version label: `v1.1` (increment version)
6. Click "Deploy"
7. Wait 2-3 minutes

---

## **PART 13: Alternative - Deploy Using AWS CLI**

If you're comfortable with command line:

### Install AWS CLI

```powershell
# Download AWS CLI installer for Windows
# Visit: https://aws.amazon.com/cli/

# Or use winget
winget install Amazon.AWSCLI

# Verify installation
aws --version
```

### Configure AWS Credentials

```powershell
aws configure

# Enter:
# AWS Access Key ID: [From IAM console]
# AWS Secret Access Key: [From IAM console]
# Default region: us-east-1
# Default output format: json
```

### Deploy with EB CLI

```powershell
# Install EB CLI
pip install awsebcli

# Initialize
cd backend/eventManagementService
eb init -p java-21 event-management-service --region us-east-1

# Create environment and deploy
eb create event-management-env --single

# Open in browser
eb open

# Deploy updates
eb deploy

# View logs
eb logs

# Terminate (when done)
eb terminate
```

---

## **PART 14: Production Database (Optional - Costs Money)**

For production, replace H2 with RDS MySQL:

### Create RDS MySQL Database

1. Go to RDS service in AWS Console
2. Click "Create database"
3. Choose MySQL
4. Template: **Free tier**
5. DB instance identifier: `event-management-db`
6. Master username: `admin`
7. Master password: (create strong password)
8. DB instance class: `db.t3.micro` (free tier)
9. Storage: 20 GB
10. Create database (10 minutes)

### Update application.properties

```properties
spring.datasource.url=jdbc:mysql://your-rds-endpoint:3306/eventdb
spring.datasource.username=admin
spring.datasource.password=your-password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

### Add to Environment Variables in Elastic Beanstalk

Don't hardcode passwords! Use environment variables.

---

## **📋 Quick Reference Commands**

```powershell
# Build JAR
cd backend/eventManagementService
./mvnw clean package -DskipTests

# Test locally
./mvnw spring-boot:run

# Test deployed API
Invoke-RestMethod -Uri "http://your-url.elasticbeanstalk.com/actuator/health"
```

---

## **🔗 Important URLs**

- **AWS Console:** https://console.aws.amazon.com/
- **Elastic Beanstalk:** https://console.aws.amazon.com/elasticbeanstalk/
- **Free Tier Dashboard:** https://console.aws.amazon.com/billing/home?#/freetier
- **Billing Dashboard:** https://console.aws.amazon.com/billing/
- **Your API URL:** `http://[your-env].elasticbeanstalk.com`

---

## **✅ CHECKLIST**

- [ ] AWS account created and verified
- [ ] Signed in to AWS Console
- [ ] JAR file built successfully
- [ ] Elastic Beanstalk application created
- [ ] Backend deployed (Health: OK)
- [ ] API URL copied
- [ ] Swagger UI accessible
- [ ] Frontend updated with AWS URL
- [ ] CORS configured correctly
- [ ] Billing alerts set up
- [ ] Tested all endpoints

---

## **🆘 Need Help?**

1. **Check application logs** in Elastic Beanstalk console
2. **Review health status** for error messages
3. **Test locally first** to ensure code works
4. **Check free tier limits** to avoid charges
5. **Ask for help** with specific error messages

---

## **📚 Next Steps**

1. ✅ Deploy backend to AWS
2. ✅ Deploy frontend to Vercel (free hosting for React)
3. ✅ Connect frontend to AWS backend
4. ✅ Add custom domain (optional - costs $10-15/year)
5. ✅ Set up CI/CD with GitHub Actions

---

**Good luck with your deployment! 🚀**

Your event management system will be live on the internet soon! 🎉
