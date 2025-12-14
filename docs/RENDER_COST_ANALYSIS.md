# Render Deployment Cost-Saving Analysis

## Executive Summary

| Component | Cost-Saving Option | Verdict |
|-----------|-------------------|---------|
| **Frontend** | Static Site | **NO** - Middleware blocks static export |
| **Backend** | Free/Sleeping Tier | **SAFE WITH MITIGATIONS** - Works for MVP |

**Recommended Setup: Option B** - Frontend Free Tier + Backend Free Tier (with cold-start mitigations)

---

## Part 1 — Frontend Static Site Feasibility

### Verdict: ❌ **NO** - Not Suitable for Static Export

The Next.js 16 frontend **cannot** be deployed as a Render Static Site without significant architectural changes.

### Blocker Analysis

#### 🚫 Critical Blocker: Middleware

| File | Impact |
|------|--------|
| [middleware.ts](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/frontend/src/middleware.ts) | **FATAL** - Edge runtime route protection |

The middleware performs server-side route protection:
```typescript
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    
    // If trying to access protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    // If logged in and trying to access auth routes, redirect to dashboard
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
}
```

**Why this blocks static export:**
- Middleware runs on Edge runtime (server-side)
- `next export` does not support middleware
- Static sites cannot read cookies server-side before rendering

### Secondary Considerations (Not Blockers Alone)

| Item | Status | Notes |
|------|--------|-------|
| Server Actions (`"use server"`) | ✅ None found | No server actions in codebase |
| API Routes (`/app/api/**`) | ✅ None found | All API calls go to external backend |
| `getServerSideProps` | ✅ None found | App Router project, not Pages Router |
| Runtime env vars | ✅ Safe | Only `NEXT_PUBLIC_*` vars used |
| Dynamic routes | ✅ Safe | User-facing routes are client-rendered |

### Current Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone', // Currently set for Docker deployment
};
```

### What Would Be Required for Static Export

To enable static export (`output: "export"`), you would need:

1. **Remove/Refactor Middleware** (HIGH EFFORT)
   - Move auth protection to client-side React guards
   - Implement `useEffect` redirects on protected pages
   - This exposes a brief "flash of protected content" UX issue

2. **Update next.config.ts**
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true, // Required for static export
     },
   };
   ```

3. **Handle Dynamic Imports Differently**
   - Current `{ ssr: false }` dynamic imports are fine
   - Leaflet maps already handled correctly

### Authentication with Remote Backend

| Scenario | Works? |
|----------|--------|
| JWT stored in localStorage | ✅ Yes |
| JWT in cookies (HttpOnly) | ⚠️ Partial - No server-side validation |
| Google OAuth redirect | ✅ Yes - Backend handles OAuth |

Current implementation stores tokens in both cookies **and** localStorage ([auth.ts](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/frontend/src/lib/auth.ts#L26-36)), so auth would work with a static frontend.

---

## Part 2 — Backend Free/Sleeping Instance Feasibility

### Verdict: ✅ **SAFE WITH MITIGATIONS** - Acceptable for MVP

The Spring Boot 4 backend **can** run on Render's free tier with sleep/wake cycles.

### Cold Start Analysis

| Component | Impact | Time Estimate |
|-----------|--------|---------------|
| JVM Startup | Moderate | 5-8 seconds |
| Spring Context | Moderate | 8-15 seconds |
| Database Connection (Render PG) | Low | 1-2 seconds |
| Flyway Migrations | **Disabled** | 0 seconds |
| Data Seeder | **Disabled in prod** | 0 seconds |
| OAuth Initialization | Low | 1-2 seconds |

**Expected Cold Start: 15-25 seconds**

> [!WARNING]
> Render free tier has a 30-second health check timeout. Your estimated cold start is within tolerance but close to the limit.

### Startup Behavior Analysis

#### ✅ Data Seeder - SAFE

[DataSeeder.java](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/backend/src/main/java/com/rakta/config/DataSeeder.java#L34-35) is correctly disabled in production:

```java
@Component
@Profile("!prod")  // Only runs in non-prod profiles
public class DataSeeder implements CommandLineRunner {
```

#### ✅ Flyway Migrations - SAFE

[application-prod.yml](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/backend/src/main/resources/application-prod.yml#L46-47) disables Flyway:

```yaml
flyway:
  enabled: ${SPRING_FLYWAY_ENABLED:false}
```

#### ✅ OAuth Configuration - SAFE

[application-prod.yml](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/backend/src/main/resources/application-prod.yml#L72-73) uses safe defaults:

```yaml
google:
  client-id: ${GOOGLE_CLIENT_ID:disabled}
  client-secret: ${GOOGLE_CLIENT_SECRET:disabled}
```

OAuth failure won't crash startup - it gracefully uses "disabled" placeholders.

#### ✅ Lazy Initialization - ENABLED

[application-prod.yml](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/backend/src/main/resources/application-prod.yml#L8):

```yaml
spring:
  main:
    lazy-initialization: ${SPRING_LAZY_INIT:true}
```

This reduces startup time significantly.

#### ⚠️ Scheduled Job - NON-BLOCKING

[HealthIntegrationService.java](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/backend/src/main/java/com/rakta/service/HealthIntegrationService.java#L121-144) has an hourly sync:

```java
@Scheduled(cron = "0 0 * * * *") // Hourly
public void syncAllProviders() {
    // Syncs user integrations
}
```

**Impact:** 
- Scheduling is **not explicitly enabled** via `@EnableScheduling`
- Even if enabled, the job only runs hourly and doesn't block startup
- On free tier (sleeping), the job won't run while sleeping

#### ✅ Health Endpoint - CORRECTLY CONFIGURED

[InfraHealthController.java](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/backend/src/main/java/com/rakta/controller/InfraHealthController.java#L16-19):

```java
@GetMapping("/healthz")
public ResponseEntity<Map<String, String>> healthCheck() {
    return ResponseEntity.ok(Map.of("status", "ok"));
}
```

- Endpoint: `/healthz`
- Responds with simple JSON `{"status": "ok"}`
- Properly allowed in [SecurityConfig.java](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/backend/src/main/java/com/rakta/security/SecurityConfig.java#L49)
- Suitable for Render health checks

### Cold Start User Impact

| Action | Impact |
|--------|--------|
| First API call after sleep | 15-25 second delay |
| Login (JWT-based) | ✅ Works normally after wake |
| OAuth Login | ⚠️ May timeout if using OAuth |
| JWT Validation | ✅ Stateless, works immediately |
| Database Queries | ✅ Works after connection pool init |

### Database Connection Pool

[application-prod.yml](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/backend/src/main/resources/application-prod.yml#L16-21):

```yaml
hikari:
  maximum-pool-size: ${HIKARI_MAX_POOL_SIZE:5}  # Small pool for free tier
  minimum-idle: ${HIKARI_MIN_IDLE:2}
  idle-timeout: 30000
  connection-timeout: 20000
  max-lifetime: 1800000
```

This is well-tuned for a free tier deployment.

---

## Part 3 — Concrete Recommendations

### Recommended Setup: Option B

**Frontend Free Tier + Backend Free Tier**

This is the best cost-saving option because:
1. Frontend cannot be static (middleware dependency)
2. Backend is already optimized for cold starts
3. Both services can share the free tier sleep cycle behavior

### Cost Comparison

| Setup | Monthly Cost | Notes |
|-------|--------------|-------|
| Current (Starter + Starter + Basic DB) | $21/month | $7+$7+$7 |
| **Option B (Free + Free + Free DB)** | **$0/month** | Sleep after 15 min inactivity |
| Option C (Static + Starter + Basic DB) | N/A | Not possible (middleware) |
| Option D (Keep Paid) | $21/month | Best for production with traffic |

### Required Code Changes for Option B

#### 1. None Required for Backend ✅

The backend is already configured correctly:
- Lazy initialization enabled
- DataSeeder disabled in prod
- Flyway disabled
- OAuth graceful degradation
- Health endpoint configured
- Small connection pool

#### 2. None Required for Frontend ✅

The frontend can remain as-is:
- Docker deployment works on free tier
- Middleware will function normally
- Just uses Web Service instead of Static Site

### Required Render Blueprint Changes

Update [render.yaml](file:///Users/chromatrical/CAREER/Side%20Projects/FitSloth%20Webapp/render.yaml):

```diff
databases:
  - name: rakta-db
    databaseName: rakta
    user: rakta_user
-   plan: basic-256mb
+   plan: free

services:
  - type: web
    name: rakta-backend
    runtime: docker
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
-   plan: starter
+   plan: free
    healthCheckPath: /healthz
    # ... rest unchanged

  - type: web
    name: rakta-frontend
    runtime: docker
    dockerfilePath: ./frontend/Dockerfile
    dockerContext: ./frontend
-   plan: starter
+   plan: free
    healthCheckPath: /
    # ... rest unchanged
```

### User-Visible Tradeoffs

| Tradeoff | Severity | Mitigation |
|----------|----------|------------|
| Cold start delay (15-25s) | Medium | Add loading spinner on frontend |
| Service sleeps after 15 min | Low | Acceptable for MVP/demo |
| Free DB limit (1GB, 97 days expiry) | ⚠️ High | Must upgrade before production |
| OAuth may timeout on cold start | Low | Users can retry login |

### Recommended Frontend UX Changes (Optional)

To improve cold-start UX, consider:

```typescript
// In api.ts - Add cold-start aware messaging
if (retryCount === 0 && response.status >= 500) {
    toast.info("Waking up the server... Please wait.");
}
```

---

## Summary

| Question | Answer |
|----------|--------|
| Can frontend be static? | **NO** - Middleware blocks export |
| Can backend run on free tier? | **YES** - With acceptable cold starts |
| Recommended setup? | **Option B** - Both on free tier |
| Code changes needed? | **None** - Already configured correctly |
| render.yaml changes? | **Yes** - Change `plan: starter` → `plan: free` |
| Suitable for production? | **MVP/Demo only** - Use paid tiers for real traffic |
