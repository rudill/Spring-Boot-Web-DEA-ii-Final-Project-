# Kitchen Management Service - AWS EC2 Deployment Guide

> Complete step-by-step guide to deploy the Kitchen Management backend (Spring Boot + MySQL) on AWS EC2 Free Tier with HTTPS using DuckDNS + Let's Encrypt.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Create AWS Account](#2-create-aws-account)
3. [Launch EC2 Instance](#3-launch-ec2-instance)
4. [Configure Security Group (Firewall)](#4-configure-security-group-firewall)
5. [Allocate Elastic IP (Static IP)](#5-allocate-elastic-ip-static-ip)
6. [Connect to EC2 via SSH](#6-connect-to-ec2-via-ssh)
7. [Server Setup (Docker, Swap, etc.)](#7-server-setup-docker-swap-etc)
8. [Copy Project Files to EC2](#8-copy-project-files-to-ec2)
9. [Build & Run Docker Containers](#9-build--run-docker-containers)
10. [Setup Free Domain with DuckDNS](#10-setup-free-domain-with-duckdns)
11. [Setup HTTPS with Let's Encrypt](#11-setup-https-with-lets-encrypt)
12. [Update Frontend & CORS](#12-update-frontend--cors)
13. [Commit & Push to GitHub](#13-commit--push-to-github)
14. [Vercel Environment Variables](#14-vercel-environment-variables)
15. [Troubleshooting](#15-troubleshooting)
16. [Useful Commands](#16-useful-commands)

---

## 1. Prerequisites

Before starting, make sure you have:

- A **web browser** (Chrome, Firefox, etc.)
- **Windows PowerShell** (pre-installed on Windows)
- An **email address** for AWS account
- A **credit/debit card** for AWS identity verification (you will NOT be charged if you stay in free tier)
- A **GitHub account** (for DuckDNS login)
- The **Kitchen Management project** cloned to your local machine

---

## 2. Create AWS Account

1. Go to **https://aws.amazon.com/free/**
2. Click **Create a Free Account**
3. Enter your email and choose a root user password
4. Fill in contact information
5. Enter your credit/debit card details (for verification only — free tier won't charge you)
6. Complete phone verification
7. Select **Basic Support (Free)** plan
8. Sign in to the **AWS Management Console**

> **Note:** It may take a few minutes to a few hours for your account to be fully activated.

---

## 3. Launch EC2 Instance

1. Go to **EC2 Dashboard**: https://console.aws.amazon.com/ec2/v2/home
2. Make sure you're in a region close to you (top right corner — e.g., "US East (N. Virginia)")
3. Click **Launch instances**

### Instance Settings:

| Setting | Value |
|---------|-------|
| **Name** | `kitchen-management-service` |
| **AMI** | Amazon Linux 2023 AMI (Free tier eligible) |
| **Instance type** | `t2.micro` (Free tier eligible) |
| **Key pair** | Click "Create new key pair" |

### Create Key Pair:
- **Key pair name**: `kitchen-key`
- **Key pair type**: RSA
- **Private key file format**: `.pem`
- Click **Create key pair**
- The file `kitchen-key.pem` will download automatically
- **Move it to** `D:\keys\kitchen-key.pem` (create the `keys` folder if needed)

### Network Settings:
- Click **Edit**
- **Auto-assign public IP**: ✅ **Enable**
- **Firewall (security groups)**: Create security group
- **Security group name**: `kitchen-sg`
- Keep the default SSH rule, we'll add more rules after launch

### Configure Storage:
- Change to **16 GB** gp3 (still free tier — gives space for Docker images)

### Launch:
- Click **Launch instance**
- Wait for the instance state to show **Running** (1-2 minutes)

---

## 4. Configure Security Group (Firewall)

The security group controls which ports are accessible from the internet.

1. Go to **EC2 Dashboard** → left sidebar → **Security Groups** (under "Network & Security")
   - Direct URL: https://console.aws.amazon.com/ec2/v2/home#SecurityGroups:
2. Click on the security group attached to your instance (e.g., `kitchen-sg`)
3. Click **Inbound rules** tab
4. Click **Edit inbound rules**
5. Click **Add rule** for each of these:

| Type | Port Range | Source | Description |
|------|-----------|--------|-------------|
| **SSH** | 22 | Anywhere-IPv4 (0.0.0.0/0) | SSH access |
| **HTTP** | 80 | Anywhere-IPv4 (0.0.0.0/0) | HTTP (needed for SSL cert) |
| **HTTPS** | 443 | Anywhere-IPv4 (0.0.0.0/0) | HTTPS API access |
| **Custom TCP** | 8083 | Anywhere-IPv4 (0.0.0.0/0) | Direct API access |

6. Click **Save rules**

> **Important:** When selecting Source, use the dropdown and choose **Anywhere-IPv4** — don't type manually.

---

## 5. Allocate Elastic IP (Static IP)

Without an Elastic IP, your instance gets a new IP every time it stops/starts.

1. Go to **EC2 Dashboard** → left sidebar → **Elastic IPs**
   - Direct URL: https://console.aws.amazon.com/ec2/v2/home#Addresses:
2. Click **Allocate Elastic IP address**
3. Leave defaults → Click **Allocate**
4. Select the new Elastic IP → **Actions** → **Associate Elastic IP address**
5. Choose your `kitchen-management-service` instance from the dropdown
6. Click **Associate**
7. **Note your Elastic IP** (e.g., `34.205.134.210`) — this is your permanent server address

> **Warning:** An Elastic IP is free ONLY when associated with a running instance. If you stop the instance, release the Elastic IP to avoid charges.

---

## 6. Connect to EC2 via SSH

### Fix Key Permissions (Windows)

Open **PowerShell** and run:

```powershell
# Remove all inherited permissions
icacls "D:\keys\kitchen-key.pem" /inheritance:r

# Grant read-only to your user
icacls "D:\keys\kitchen-key.pem" /grant:r "$($env:USERNAME):(R)"

# Remove other users
icacls "D:\keys\kitchen-key.pem" /remove "NT AUTHORITY\Authenticated Users"
icacls "D:\keys\kitchen-key.pem" /remove "BUILTIN\Users"
```

### Connect via SSH

```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP
```

Replace `YOUR_ELASTIC_IP` with your actual Elastic IP (e.g., `34.205.134.210`).

### First Time Connection
You'll see:
```
The authenticity of host 'YOUR_IP' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
Type **yes** and press Enter.

### Successful Connection
You'll see:
```
   ,     #_
   ~\_  ####_        Amazon Linux 2023
  ~~  \_#####\
  ~~     \###|
[ec2-user@ip-xxx-xxx-xxx-xxx ~]$
```

> **Important:** Use `ssh.exe` (not `ssh`) in PowerShell to avoid conflicts with the `Get-Process` alias.

---

## 7. Server Setup (Docker, Swap, etc.)

Run these commands **inside the SSH session** (after connecting to EC2):

### 7.1 Create Swap File (Prevents Out-of-Memory crashes)

t2.micro has only 1GB RAM. Swap adds virtual memory using disk space.

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

Verify swap is active:
```bash
free -h
# Should show "Swap: 2.0Gi" in the output
```

### 7.2 Install Docker

```bash
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
```

### 7.3 Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Verify:
```bash
docker-compose --version
# Should show: Docker Compose version v5.x.x
```

### 7.4 Install Docker Buildx (for multi-stage builds)

```bash
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -L "https://github.com/docker/buildx/releases/download/v0.19.3/buildx-v0.19.3.linux-amd64" -o /usr/local/lib/docker/cli-plugins/docker-buildx
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx
```

### 7.5 Create App Directory

```bash
mkdir -p ~/kitchen-app/init-db
```

### 7.6 Exit SSH

```bash
exit
```

---

## 8. Copy Project Files to EC2

Run these commands **from Windows PowerShell** (not inside SSH):

### Navigate to project directory

```powershell
cd D:\Microservice-Based-Hotel-Management-System-main\Microservice-Based-Hotel-Management-System-main\backend\kitchenManagementService
```

### Copy files via SCP

```powershell
# Copy Docker and build files
scp.exe -i "D:\keys\kitchen-key.pem" docker-compose.yml Dockerfile pom.xml mvnw ec2-user@YOUR_ELASTIC_IP:~/kitchen-app/

# Copy Maven wrapper directory
scp.exe -i "D:\keys\kitchen-key.pem" -r .mvn ec2-user@YOUR_ELASTIC_IP:~/kitchen-app/

# Copy Java source code
scp.exe -i "D:\keys\kitchen-key.pem" -r src ec2-user@YOUR_ELASTIC_IP:~/kitchen-app/

# Copy database init script
scp.exe -i "D:\keys\kitchen-key.pem" init-db/01-init.sql ec2-user@YOUR_ELASTIC_IP:~/kitchen-app/init-db/
```

### Verify files were copied

```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "ls -la ~/kitchen-app/"
```

You should see: `Dockerfile`, `docker-compose.yml`, `pom.xml`, `mvnw`, `src/`, `init-db/`, `.mvn/`

---

## 9. Build & Run Docker Containers

### Build and start (takes 3-5 minutes on first run)

```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "cd ~/kitchen-app && chmod +x mvnw && sudo docker-compose up -d --build"
```

### Verify containers are running

```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "sudo docker ps"
```

You should see two containers both showing **(healthy)**:
- `kitchen-management-service` — Spring Boot app on port 8083
- `kitchen-mysql-db` — MySQL 8.0 database

### Test the API

```powershell
Invoke-RestMethod -Uri "http://YOUR_ELASTIC_IP:8083/api/kitchen/menu" -Method GET
```

Expected response:
```json
{
  "success": true,
  "message": "Menu items retrieved successfully",
  "data": []
}
```

> **If you see this response, your backend is running!** But we still need HTTPS for the Vercel frontend to connect.

---

## 10. Setup Free Domain with DuckDNS

Vercel frontends use HTTPS, so they **cannot** call HTTP APIs (browser blocks mixed content). We need a free domain with a real SSL certificate.

### 10.1 Create DuckDNS Account

1. Go to **https://www.duckdns.org**
2. Click **Sign in** with GitHub (or Google, Reddit, Twitter)
3. You'll see your **token** at the top of the page — **copy and save it**
   - Looks like: `19a28358-b139-4f2c-9ae5-6a7b5dbdb5a6`

### 10.2 Create a Subdomain

1. In the **sub domain** text box, type your desired name (e.g., `kitchen-management-service`)
2. Click **add domain**
3. Change the **current ip** field to your **Elastic IP** (e.g., `34.205.134.210`)
4. Click **update ip**

### 10.3 Verify DNS

```powershell
nslookup kitchen-management-service.duckdns.org 8.8.8.8
```

It should resolve to your Elastic IP.

---

## 11. Setup HTTPS with Let's Encrypt

### 11.1 Install nginx (reverse proxy)

```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "sudo yum install -y nginx"
```

### 11.2 Create nginx Config File

Create a file called `kitchen-api.conf` on your local machine with this content:

```nginx
server {
    listen 80;
    server_name YOUR_SUBDOMAIN.duckdns.org;

    location / {
        proxy_pass http://localhost:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Replace `YOUR_SUBDOMAIN.duckdns.org` with your actual domain (e.g., `kitchen-management-service.duckdns.org`).

### 11.3 Upload and Apply nginx Config

```powershell
# Upload the config
scp.exe -i "D:\keys\kitchen-key.pem" kitchen-api.conf ec2-user@YOUR_ELASTIC_IP:~/kitchen-api.conf

# Install config and start nginx
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "sudo cp ~/kitchen-api.conf /etc/nginx/conf.d/kitchen-api.conf && sudo nginx -t && sudo systemctl start nginx && sudo systemctl enable nginx"
```

### 11.4 Install Certbot

```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "sudo yum install -y certbot python3-certbot-nginx"
```

### 11.5 Get SSL Certificate

```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "sudo certbot --nginx -d YOUR_SUBDOMAIN.duckdns.org --non-interactive --agree-tos --email YOUR_EMAIL@gmail.com --redirect"
```

Replace:
- `YOUR_SUBDOMAIN.duckdns.org` with your domain
- `YOUR_EMAIL@gmail.com` with your email

You should see:
```
Successfully received certificate.
Congratulations! You have successfully enabled HTTPS on https://YOUR_SUBDOMAIN.duckdns.org
```

### 11.6 Enable Auto-Renewal

```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "sudo systemctl start certbot-renew.timer"
```

### 11.7 Test HTTPS

```powershell
Invoke-RestMethod -Uri "https://YOUR_SUBDOMAIN.duckdns.org/api/kitchen/menu" -Method GET
```

Expected response:
```json
{
  "success": true,
  "message": "Menu items retrieved successfully",
  "data": []
}
```

> **Your API is now available over HTTPS!**

---

## 12. Update Frontend & CORS

### 12.1 Update Frontend API URL

Edit `frontend/kitchen-management/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://YOUR_SUBDOMAIN.duckdns.org/api/kitchen';
```

### 12.2 Update CORS in Backend

Edit `backend/kitchenManagementService/src/main/java/com/nsbm/group03/kitchenManagementService/config/AppConfig.java`:

```java
.allowedOriginPatterns(
    "http://localhost:*",
    "https://*.vercel.app",
    "https://*.duckdns.org",
    "https://*.devtunnels.ms"
)
```

### 12.3 Re-upload Updated CORS to EC2

```powershell
# Copy updated AppConfig.java
scp.exe -i "D:\keys\kitchen-key.pem" src\main\java\com\nsbm\group03\kitchenManagementService\config\AppConfig.java ec2-user@YOUR_ELASTIC_IP:~/kitchen-app/src/main/java/com/nsbm/group03/kitchenManagementService/config/AppConfig.java

# Rebuild the kitchen service container (database stays intact)
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "cd ~/kitchen-app && sudo docker-compose up -d --build kitchen-service"
```

---

## 13. Commit & Push to GitHub

```powershell
cd D:\Microservice-Based-Hotel-Management-System-main\Microservice-Based-Hotel-Management-System-main

# Stage only kitchen-related files
git add frontend/kitchen-management/src/services/api.js
git add backend/kitchenManagementService/src/main/java/com/nsbm/group03/kitchenManagementService/config/AppConfig.java

# Commit
git commit -m "Update API URL and CORS for AWS EC2 deployment"

# Push
git push origin main
```

---

## 14. Vercel Environment Variables

1. Go to **Vercel Dashboard** → your project
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://YOUR_SUBDOMAIN.duckdns.org/api/kitchen`
4. Click **Save**
5. Go to **Deployments** → click the three dots on the latest → **Redeploy** → check **Redeploy with existing Build Cache** OFF → **Redeploy**

---

## 15. Troubleshooting

### SSH Connection Refused or Timeout

```powershell
# Test if port 22 is reachable
Test-NetConnection -ComputerName YOUR_ELASTIC_IP -Port 22

# If TcpTestSucceeded is False:
# - Check Security Group has SSH (port 22) inbound rule
# - Check instance is Running in EC2 console
# - Try stop and start (not reboot) the instance
```

### SSH "Bad Permissions" on Key File

```powershell
icacls "D:\keys\kitchen-key.pem" /inheritance:r
icacls "D:\keys\kitchen-key.pem" /grant:r "$($env:USERNAME):(R)"
icacls "D:\keys\kitchen-key.pem" /remove "NT AUTHORITY\Authenticated Users"
icacls "D:\keys\kitchen-key.pem" /remove "BUILTIN\Users"
icacls "D:\keys\kitchen-key.pem" /remove "BUILTIN\Administrators"
icacls "D:\keys\kitchen-key.pem" /remove "NT AUTHORITY\SYSTEM"
```

### SSH "Permission denied (publickey)"
- Wrong username — use `ec2-user` for Amazon Linux
- Wrong key file — make sure it matches the key pair selected during launch

### Instance Becomes Unresponsive (Out of Memory)
- **Stop** the instance (not reboot) → **Start** again
- Make sure you created the 2GB swap file (Step 7.1)

### Docker Build Fails
```powershell
# Check build logs
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "cd ~/kitchen-app && sudo docker-compose logs kitchen-service"
```

### CORS Errors on Frontend
- Make sure your Vercel URL is in `allowedOriginPatterns` in `AppConfig.java`
- Rebuild the kitchen-service container after changing CORS

### ERR_SSL_PROTOCOL_ERROR
- Vercel (HTTPS) cannot call HTTP APIs — you need HTTPS on the backend
- Follow Steps 10-11 for DuckDNS + Let's Encrypt setup

### SSL Certificate Expired
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "sudo certbot renew"
```

---

## 16. Useful Commands

### SSH into EC2
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP
```

### Check Container Status
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "sudo docker ps"
```

### View Container Logs
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "cd ~/kitchen-app && sudo docker-compose logs -f kitchen-service"
```

### Restart Containers
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "cd ~/kitchen-app && sudo docker-compose restart"
```

### Stop Containers
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "cd ~/kitchen-app && sudo docker-compose down"
```

### Start Containers
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "cd ~/kitchen-app && sudo docker-compose up -d"
```

### Rebuild After Code Changes
```powershell
# 1. Copy updated files
scp.exe -i "D:\keys\kitchen-key.pem" -r src ec2-user@YOUR_ELASTIC_IP:~/kitchen-app/

# 2. Rebuild and restart
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "cd ~/kitchen-app && sudo docker-compose up -d --build kitchen-service"
```

### Check Memory Usage
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "free -h"
```

### Check Disk Usage
```powershell
ssh.exe -i "D:\keys\kitchen-key.pem" ec2-user@YOUR_ELASTIC_IP "df -h"
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     INTERNET                             │
│                                                          │
│   Vercel Frontend (HTTPS)                                │
│   hotel-management-systemk.vercel.app                    │
│          │                                               │
│          │ HTTPS API calls                               │
│          ▼                                               │
│   DuckDNS Domain                                         │
│   kitchen-management-service.duckdns.org                 │
│          │                                               │
│          ▼                                               │
│   ┌──────────────────────────────────────┐               │
│   │         AWS EC2 (t2.micro)           │               │
│   │                                      │               │
│   │   nginx (port 443 HTTPS)             │               │
│   │     ↓ reverse proxy                  │               │
│   │   Spring Boot (port 8083)            │               │
│   │     ↓ JDBC                           │               │
│   │   MySQL 8.0 (port 3306)              │               │
│   │                                      │               │
│   │   All running in Docker containers   │               │
│   └──────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

## Cost Summary

| Resource | Cost |
|----------|------|
| EC2 t2.micro | **Free** (750 hours/month for 12 months) |
| EBS 16GB | **Free** (30GB free for 12 months) |
| Elastic IP | **Free** (when associated with running instance) |
| DuckDNS domain | **Free** (forever) |
| Let's Encrypt SSL | **Free** (forever, auto-renews) |
| **Total** | **$0/month** (for first 12 months) |

> **After 12 months:** EC2 t2.micro costs ~$8.50/month. Consider stopping the instance when not in use.
