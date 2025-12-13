# Production Deployment Checklist

## 🔧 Frontend Environment (.env.production)

```bash
# ✅ Required - No trailing slash!
NEXT_PUBLIC_API_URL=https://sungchunn.com/api
```

---

## 🔧 Backend Environment (application.properties)

```properties
# ✅ CORS - Include all domain variants
cors.allowed-origins=https://sungchunn.com,https://www.sungchunn.com

# ✅ Database (PostgreSQL for production)
spring.datasource.url=jdbc:postgresql://localhost:5432/rakta
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# ✅ JWT Secret (use strong random key)
jwt.secret=${JWT_SECRET}  # At least 64 characters

# ✅ OpenAI (if using AI insights)
openai.api.key=${OPENAI_API_KEY}
```

---

## 🌐 Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name sungchunn.com www.sungchunn.com;

    # SSL certificates
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API - CRITICAL: Match prefix handling!
    # Option A: Keep /api prefix (Spring expects /api/...)
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP redirect to HTTPS
server {
    listen 80;
    server_name sungchunn.com www.sungchunn.com;
    return 301 https://$host$request_uri;
}
```

---

## ✅ Pre-Deployment Checklist

| # | Item | Status |
|---|------|--------|
| 1 | `NEXT_PUBLIC_API_URL` set (no trailing slash) | ☐ |
| 2 | `cors.allowed-origins` includes production domain | ☐ |
| 3 | JWT secret is strong (64+ chars) | ☐ |
| 4 | PostgreSQL credentials configured | ☐ |
| 5 | Nginx proxies `/api/` → Spring port 8080 | ☐ |
| 6 | SSL certificates valid and renewed | ☐ |
| 7 | Spring Boot JAR built with `./mvnw package -DskipTests` | ☐ |
| 8 | Next.js built with `npm run build` | ☐ |

---

## 🧪 Deployment Verification Commands

```bash
# 1. Test backend directly on VPS
curl -v http://localhost:8080/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# 2. Test through Nginx
curl -v https://sungchunn.com/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# 3. Check for double slashes (should return 404, not connection error)
curl -v https://sungchunn.com/api//auth//register

# 4. Verify CORS headers (OPTIONS preflight)
curl -v -X OPTIONS https://sungchunn.com/api/auth/register \
  -H "Origin: https://sungchunn.com" \
  -H "Access-Control-Request-Method: POST"
```

---

## 🐞 Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Cannot connect to server" | `NEXT_PUBLIC_API_URL` not set | Set env var in production |
| 404 on API calls | Nginx strips `/api` but Spring expects it | Match Nginx config with Spring paths |
| CORS error in console | Origin not in `cors.allowed-origins` | Add production domain to backend config |
| Request hangs indefinitely | Firewall blocking port 8080 | Open port or use Nginx proxy only |
| Double slashes in URL | Trailing slash in `API_URL` | Remove trailing slash (now auto-fixed) |
