# Rakta Production Deployment Guide

This guide covers deploying the Rakta application to a Hostinger VPS using Docker Compose with Traefik reverse proxy and Let's Encrypt SSL.

## Architecture

- **Traefik**: Reverse proxy with automatic SSL/TLS via Let's Encrypt
- **PostgreSQL 16**: Production database with persistent storage
- **Backend**: Spring Boot 4.0.0 (Java 17) running on port 8080 (internal)
- **Frontend**: Next.js 16 (React 19) running on port 3000 (internal)

## Domain Routing

- `https://sungchunn.com` → Frontend (Next.js)
- `https://www.sungchunn.com` → Frontend (Next.js)
- `https://api.sungchunn.com` → Backend (Spring Boot)

## Prerequisites

### On Your VPS (Hostinger)

1. **DNS Configuration** - Point these A records to your VPS IP:
   ```
   sungchunn.com → your_vps_ip
   www.sungchunn.com → your_vps_ip
   api.sungchunn.com → your_vps_ip
   ```

2. **Firewall** - Open ports 80 and 443:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **Install Docker and Docker Compose**:
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Add your user to docker group
   sudo usermod -aG docker $USER

   # Log out and back in, then verify
   docker --version
   docker compose version
   ```

4. **Install Git**:
   ```bash
   sudo apt update
   sudo apt install git -y
   ```

## Local Testing (Before Deployment)

### Option 1: Local Testing with Direct Port Exposure (Recommended)

```bash
# 1. Ensure .env file exists with local values
cp .env.example .env
# Edit .env with your local values

# 2. Build and run
docker compose -f docker-compose.local.yml up --build -d

# 3. Verify services are running
docker compose -f docker-compose.local.yml ps

# 4. Check logs
docker compose -f docker-compose.local.yml logs -f

# 5. Test endpoints
# Frontend: http://localhost:3000
# Backend: http://localhost:8080/actuator/health

# 6. Cleanup
docker compose -f docker-compose.local.yml down
```

### Option 2: Local Testing with Traefik (Advanced)

This requires editing your `/etc/hosts` file to simulate DNS:

```bash
# Add to /etc/hosts
127.0.0.1 sungchunn.com www.sungchunn.com api.sungchunn.com

# Run with production compose file
docker compose up --build -d

# Note: SSL will not work locally, use HTTP
# http://sungchunn.com (will redirect to https and fail)
```

## VPS Deployment Steps

### 1. Clone Repository on VPS

```bash
# SSH into your VPS
ssh user@your_vps_ip

# Clone the repository
git clone git@github.com:Sungchunn/Rakta-Webapp.git
cd Rakta-Webapp
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit with your production values
nano .env
```

**Required values in `.env`:**
```bash
DOMAIN=sungchunn.com
LE_EMAIL=your-email@example.com  # For Let's Encrypt notifications

POSTGRES_DB=rakta
POSTGRES_USER=rakta_user
POSTGRES_PASSWORD=your_secure_password_here  # Use a strong password!

# Generate a secure JWT secret (64+ characters)
# Run: openssl rand -base64 64
JWT_SECRET=your_generated_secure_jwt_secret_here
```

### 3. Deploy

```bash
# Build and start all services
docker compose up -d --build

# Monitor logs (Ctrl+C to exit)
docker compose logs -f

# Check service status
docker compose ps
```

### 4. Verify Deployment

```bash
# Check if all containers are running
docker compose ps

# Should show:
# - rakta-traefik (healthy)
# - rakta-postgres (healthy)
# - rakta-backend (healthy)
# - rakta-frontend (healthy)

# Check backend health
curl https://api.sungchunn.com/actuator/health

# Visit frontend
# https://sungchunn.com
```

### 5. Monitor Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f traefik
docker compose logs -f postgres
```

## Future Updates (Git Pull Workflow)

After the initial deployment, updating is simple:

```bash
cd /path/to/Rakta-Webapp

# Pull latest changes
git pull

# Rebuild and restart
docker compose up -d --build

# Check logs
docker compose logs -f
```

## Useful Commands

### View Running Containers
```bash
docker compose ps
```

### Stop All Services
```bash
docker compose down
```

### Stop and Remove All Data (CAUTION!)
```bash
docker compose down -v  # This deletes the database volume!
```

### Restart a Single Service
```bash
docker compose restart backend
docker compose restart frontend
```

### Access Database
```bash
docker compose exec postgres psql -U rakta_user -d rakta
```

### View Traefik Dashboard (if enabled)
Edit `docker-compose.yml` to enable the dashboard, then access at `http://your_vps_ip:8080`

### Backup Database
```bash
docker compose exec postgres pg_dump -U rakta_user rakta > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
cat backup_20250101.sql | docker compose exec -T postgres psql -U rakta_user rakta
```

## Troubleshooting

### SSL Certificate Issues

```bash
# Check Traefik logs
docker compose logs traefik

# Ensure DNS is properly configured
nslookup sungchunn.com
nslookup api.sungchunn.com

# Ensure ports 80 and 443 are open
sudo netstat -tlnp | grep -E ':(80|443)'
```

### Backend Won't Start

```bash
# Check backend logs
docker compose logs backend

# Common issues:
# - Database connection: Check POSTGRES_* env vars
# - Flyway migrations: Check db/migration/*.sql files
# - JWT secret: Ensure JWT_SECRET is set and long enough
```

### Frontend Won't Start

```bash
# Check frontend logs
docker compose logs frontend

# Common issues:
# - API connection: Check NEXT_PUBLIC_API_URL
# - Build errors: Check if standalone output is enabled in next.config.ts
```

### Database Connection Issues

```bash
# Check if postgres is healthy
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U rakta_user -d rakta

# Check logs
docker compose logs postgres
```

## Security Notes

1. **Never commit `.env`** - It contains secrets
2. **Use strong passwords** - Especially for POSTGRES_PASSWORD
3. **Rotate JWT_SECRET** - Change periodically for security
4. **Keep Docker updated** - Run `apt update && apt upgrade` regularly
5. **Monitor logs** - Check for suspicious activity
6. **Backup regularly** - Use the database backup commands above

## Performance Optimization

The configuration includes:
- Lazy initialization for reduced startup CPU
- HikariCP connection pooling (max 5 connections)
- Reduced logging in production
- Docker healthchecks for reliability
- Multi-stage builds for smaller images

## Support

For issues or questions:
- Check the logs first: `docker compose logs -f`
- Review this guide's troubleshooting section
- Check GitHub Issues: https://github.com/Sungchunn/Rakta-Webapp/issues
