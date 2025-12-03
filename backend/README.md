# Rakta Backend - Spring Boot API

This is the backend REST API for the Rakta blood donation tracking application, built with Spring Boot 4.0.0 and Java 17.

## Architecture

The backend follows a layered architecture pattern:

```
Controller → Service → Repository → Database
     ↓          ↓          ↓
    DTO      Business   Entity
           Logic
```

### Package Structure

```
com.rakta/
├── controller/         # REST API endpoints
│   ├── AuthController.java
│   ├── DonationController.java
│   ├── HealthController.java
│   └── LocationController.java
├── dto/                # Data Transfer Objects (request/response)
│   └── AuthDto.java
├── entity/             # JPA entities (database models)
│   ├── User.java
│   ├── Donation.java
│   ├── DonationLocation.java
│   └── HealthLog.java
├── repository/         # Spring Data JPA repositories
│   ├── UserRepository.java
│   ├── DonationRepository.java
│   ├── HealthLogRepository.java
│   └── LocationRepository.java
├── security/           # Security configuration
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   ├── SecurityConfig.java
│   ├── CustomUserDetailsService.java
│   └── JwtAuthenticationEntryPoint.java
└── service/            # Business logic
    ├── UserService.java
    ├── DonationService.java
    └── LocationService.java
```

## Technology Stack

- **Spring Boot 4.0.0** - Application framework
- **Spring Web MVC** - RESTful API development
- **Spring Data JPA** - Database ORM and repository pattern
- **Spring Security** - Authentication and authorization
- **JWT (JJWT 0.11.5)** - JSON Web Token authentication
- **Hibernate** - JPA implementation
- **Flyway** - Database migrations
- **H2 Database** - In-memory database (development)
- **PostgreSQL** - Relational database (production-ready)
- **Lombok** - Reduces boilerplate code
- **BCrypt** - Password hashing
- **Bean Validation (JSR-380)** - Input validation

## Prerequisites

- **Java 17 or higher** (OpenJDK or Oracle JDK)
- **Maven 3.6+** (or use included Maven wrapper)
- **PostgreSQL 12+** (for production) or H2 for development

## Quick Start

### Option 1: Development Mode (H2 Database - Current Configuration)

1. **Clone the repository** (if not already done)
   ```bash
   git clone git@github.com:Sungchunn/Rakta-Junior-Dev-Webapp.git
   cd Rakta-Junior-Dev-Webapp/backend
   ```

2. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. **Verify it's running**
   ```bash
   curl http://localhost:8080/api/locations
   ```
   You should receive a JSON response with donation locations.

### Option 2: Production Mode (PostgreSQL)

1. **Install and start PostgreSQL**
   ```bash
   # macOS
   brew install postgresql@14
   brew services start postgresql@14

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create database**
   ```bash
   createdb rakta
   ```

3. **Configure database connection**
   - Edit `src/main/resources/application.yml`
   - Uncomment PostgreSQL configuration (lines 5-9)
   - Comment out H2 configuration (lines 10-18)
   - Update credentials:
     ```yaml
     spring:
       datasource:
         url: jdbc:postgresql://localhost:5432/rakta
         username: your_username
         password: your_password
     ```

4. **Enable Flyway migrations**
   ```yaml
   spring:
     flyway:
       enabled: true
       locations: classpath:db/migration
   ```

5. **Uncomment PostgreSQL dependency** in `pom.xml` (lines 75-79)

6. **Run migrations and start**
   ```bash
   ./mvnw flyway:migrate
   ./mvnw spring-boot:run
   ```

## Configuration

### Application Configuration

The main configuration file is `src/main/resources/application.yml`:

```yaml
server:
  port: 8080                    # API port

spring:
  application:
    name: rakta

  datasource:
    # Choose one: H2 (development) or PostgreSQL (production)

  jpa:
    hibernate:
      ddl-auto: update          # Options: validate, update, create, create-drop
    show-sql: true              # Log SQL queries (disable in production)

  flyway:
    enabled: false              # Set to true for PostgreSQL with migrations

jwt:
  secret: ${JWT_SECRET:your-secret-key-at-least-32-characters-long}
  expiration: 86400000          # 24 hours in milliseconds
```

### Environment Variables

Create a `.env` file or set environment variables:

```properties
# Required for JWT authentication
JWT_SECRET=your-secure-secret-key-minimum-32-characters

# Database configuration (if using PostgreSQL)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/rakta
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

For local development, you can also use `application-dev.yml` for development-specific settings.

## Database Migrations

Database migrations are managed with Flyway and located in `src/main/resources/db/migration/`.

### Migration Files

1. **V1__Create_users_table.sql** - Creates users table with authentication fields
2. **V2__Create_donation_locations_table.sql** - Creates donation centers table
3. **V3__Create_donations_table.sql** - Creates donations table with foreign keys
4. **V4__Insert_sample_locations.sql** - Seeds initial donation center data
5. **V5__Create_health_logs_table.sql** - Creates health logs table

### Running Migrations

```bash
# Run all pending migrations
./mvnw flyway:migrate

# Get migration status
./mvnw flyway:info

# Repair migrations (if out of sync)
./mvnw flyway:repair

# Clean database (CAUTION: Drops all objects)
./mvnw flyway:clean
```

### Creating New Migrations

1. Create a new file in `src/main/resources/db/migration/`
2. Name it following the pattern: `V{version}__{description}.sql`
   - Example: `V6__Add_blood_type_to_users.sql`
3. Write your SQL DDL statements
4. Run `./mvnw flyway:migrate`

## API Endpoints

### Authentication (Public)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "age": 28,
  "gender": "MALE",
  "weight": 75.5,
  "city": "San Francisco"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "email": "john@example.com"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "email": "john@example.com"
}
```

### Donations (Protected - Requires JWT)

#### Get User's Donations
```http
GET /api/donations
Authorization: Bearer {jwt_token}

Response: 200 OK
[
  {
    "id": 1,
    "donationDate": "2025-11-10",
    "donationType": "WHOLE_BLOOD",
    "location": {
      "id": 1,
      "name": "San Francisco Blood Center"
    },
    "notes": "Felt great after donation",
    "createdAt": "2025-11-10T14:30:00"
  }
]
```

#### Log New Donation
```http
POST /api/donations
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "donationDate": "2025-11-24",
  "donationType": "WHOLE_BLOOD",
  "locationId": 1,
  "notes": "Regular donation"
}

Response: 201 CREATED
```

#### Check Eligibility
```http
GET /api/donations/eligibility
Authorization: Bearer {jwt_token}

Response: 200 OK
{
  "eligible": false,
  "lastDonationDate": "2025-11-10",
  "nextEligibleDate": "2026-01-05",
  "daysUntilEligible": 42
}
```

### Health Logs (Protected)

#### Get User's Health Logs
```http
GET /api/health
Authorization: Bearer {jwt_token}

Response: 200 OK
[
  {
    "id": 1,
    "date": "2025-11-24",
    "sleepHours": 8,
    "feeling": "GREAT",
    "createdAt": "2025-11-24T09:00:00"
  }
]
```

#### Log Daily Health
```http
POST /api/health
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "date": "2025-11-24",
  "sleepHours": 7.5,
  "feeling": "GOOD"
}

Response: 201 CREATED
```

### Locations (Public)

#### Get All Donation Centers
```http
GET /api/locations

Response: 200 OK
[
  {
    "id": 1,
    "name": "San Francisco Blood Center",
    "type": "HOSPITAL",
    "address": "123 Main St, San Francisco, CA 94102",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "contactInfo": "415-555-0100",
    "openingHours": "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM"
  }
]
```

#### Add Donation Center
```http
POST /api/locations
Content-Type: application/json

{
  "name": "Oakland Blood Center",
  "type": "HOSPITAL",
  "address": "456 Oak St, Oakland, CA 94612",
  "latitude": 37.8044,
  "longitude": -122.2712,
  "contactInfo": "510-555-0200",
  "openingHours": "Mon-Sat: 8AM-5PM"
}

Response: 201 CREATED
```

## Security

### JWT Authentication

The API uses JWT (JSON Web Tokens) for stateless authentication:

1. User logs in with credentials
2. Server validates and generates JWT token
3. Client includes token in `Authorization: Bearer {token}` header
4. Server validates token for protected endpoints

**Token Configuration:**
- Secret key: Configured via `JWT_SECRET` environment variable
- Expiration: 24 hours (configurable in `application.yml`)
- Algorithm: HS256 (HMAC with SHA-256)

### Password Security

- Passwords are hashed using **BCrypt** with default strength (10 rounds)
- Plain-text passwords are never stored in the database
- Password validation enforced at the DTO level

### Protected Endpoints

The following endpoints require authentication:
- `/api/donations/**` - All donation endpoints
- `/api/health/**` - All health log endpoints

Public endpoints (no authentication required):
- `/api/auth/**` - Login and registration
- `/api/locations/**` - Donation center listing

### CORS Configuration

CORS is configured in `SecurityConfig.java`. Update allowed origins for production:

```java
@Bean
public CorsFilter corsFilter() {
    // Configure allowed origins based on environment
}
```

## Building and Running

### Development Mode

```bash
# Run with hot reload (Spring Boot DevTools)
./mvnw spring-boot:run

# Run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Build JAR

```bash
# Build production JAR
./mvnw clean package

# Skip tests
./mvnw clean package -DskipTests

# Output location
# target/rakta-0.0.1-SNAPSHOT.jar
```

### Run JAR

```bash
# Run the built JAR
java -jar target/rakta-0.0.1-SNAPSHOT.jar

# With environment variables
JWT_SECRET=my-secret java -jar target/rakta-0.0.1-SNAPSHOT.jar

# With specific profile
java -jar target/rakta-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## Testing

### Run All Tests

```bash
./mvnw test
```

### Run Specific Test Class

```bash
./mvnw test -Dtest=AuthControllerTest
```

### Test with Coverage

```bash
./mvnw test jacoco:report
# Report generated in target/site/jacoco/index.html
```

### Integration Tests

```bash
./mvnw verify
```

## Logging

Logging is configured in `application.yml`:

```yaml
logging:
  level:
    root: INFO
    com.rakta: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
```

**Log Levels:**
- `TRACE` - Very detailed, for debugging only
- `DEBUG` - Detailed information for development
- `INFO` - General informational messages
- `WARN` - Warning messages
- `ERROR` - Error messages only

For production, set levels to `WARN` or `ERROR` to reduce log volume.

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   psql -h localhost -U your_username -d rakta
   ```

2. Check credentials in `application.yml`

3. Ensure database exists:
   ```bash
   createdb rakta
   ```

### JWT Token Issues

- Ensure `JWT_SECRET` is set and at least 32 characters long
- Check token expiration time in `application.yml`
- Verify token is included in `Authorization: Bearer {token}` header

### Flyway Migration Errors

```bash
# Check migration status
./mvnw flyway:info

# Repair checksums (if migrations were modified)
./mvnw flyway:repair

# Clean and re-run (CAUTION: Deletes all data)
./mvnw flyway:clean
./mvnw flyway:migrate
```

## Performance Optimization

### Database Indexing

Key indexes are defined in migration files:
- `users.email` - Unique index for fast authentication lookups
- `donations.user_id` - Index for user's donation history
- `health_logs.user_id, date` - Composite unique index

### Connection Pooling

HikariCP is used for connection pooling (Spring Boot default):

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 20000
```

### Query Optimization

- Use `@EntityGraph` to avoid N+1 queries
- Pagination for large result sets
- Fetch only required fields with projections

## Deployment

### Environment-Specific Configuration

Create profile-specific configuration files:
- `application-dev.yml` - Development
- `application-staging.yml` - Staging
- `application-prod.yml` - Production

Activate with:
```bash
java -jar app.jar --spring.profiles.active=prod
```

### Production Checklist

- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Use PostgreSQL instead of H2
- [ ] Enable HTTPS/TLS
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Disable `show-sql` in production
- [ ] Configure proper CORS origins
- [ ] Set logging levels to `WARN` or `ERROR`
- [ ] Enable database connection pooling
- [ ] Set up database backups
- [ ] Configure health check endpoint
- [ ] Monitor application metrics

### Deployment Platforms

#### Heroku
```bash
heroku create rakta-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

#### Railway
```bash
railway login
railway init
railway add --database postgresql
railway up
```

#### AWS Elastic Beanstalk
```bash
eb init -p java-17 rakta-api
eb create rakta-prod
eb deploy
```

## Code Style and Best Practices

### Controller Layer
- Keep controllers thin - delegate to services
- Use DTOs for request/response
- Return appropriate HTTP status codes
- Handle exceptions with `@ControllerAdvice`

### Service Layer
- Business logic lives here
- Transactional boundaries with `@Transactional`
- Throw meaningful exceptions
- Keep methods focused (single responsibility)

### Repository Layer
- Use Spring Data JPA method naming conventions
- Custom queries with `@Query` when needed
- Avoid business logic in repositories

### Lombok Usage
- `@Data` for DTOs (simple getters/setters)
- `@Getter/@Setter` for entities (avoid generating equals/hashCode)
- `@Builder` for complex object creation
- `@Slf4j` for logging

## Additional Resources

### Spring Boot Documentation
- [Spring Boot Reference](https://docs.spring.io/spring-boot/4.0.0/reference/)
- [Spring Data JPA](https://docs.spring.io/spring-boot/4.0.0/reference/data/sql.html#data.sql.jpa-and-spring-data)
- [Spring Security](https://docs.spring.io/spring-boot/4.0.0/reference/web/spring-security.html)

### Tools and Libraries
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [JWT Introduction](https://jwt.io/introduction)
- [Lombok Features](https://projectlombok.org/features/)
- [Hibernate ORM](https://hibernate.org/orm/documentation/)

### API Testing
- [Postman](https://www.postman.com/) - API testing tool
- [curl](https://curl.se/) - Command-line HTTP client
- [HTTPie](https://httpie.io/) - User-friendly HTTP client

---

For frontend integration, see [../frontend/README.md](../frontend/README.md)

For complete project documentation, see [../README.md](../README.md)

