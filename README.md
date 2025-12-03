# Rakta Blood Donation Webapp

A full-stack web application designed to help people build a consistent, healthy, and proud blood-donation habit. Rakta empowers users to track their donation journey, monitor health readiness, and find nearby donation centers.

## Overview

Rakta provides comprehensive tools for blood donors:
- **Track donation history** with detailed records
- **Monitor eligibility** with real-time countdown (56-day waiting period)
- **Log daily health metrics** (sleep hours and feeling status)
- **Find donation centers** with location details and contact information
- **View personalized guidance** and achieve donation milestones
- **Secure authentication** with JWT tokens

## Tech Stack

### Backend
- **Framework**: Spring Boot 4.0.0 with Java 17
- **Database**: PostgreSQL (production) / H2 (development)
- **Authentication**: JWT (JSON Web Tokens) with Spring Security
- **ORM**: Spring Data JPA with Hibernate
- **Migration**: Flyway database migrations
- **Security**: BCrypt password hashing
- **Build Tool**: Maven
- **Architecture**: Repository-Service-Controller pattern

### Frontend
- **Framework**: Next.js 16.0.3 with React 19.2.0
- **Language**: TypeScript 5.x
- **Routing**: App Router (Next.js 16 architecture)
- **Styling**: CSS Modules
- **HTTP Client**: Fetch API with custom wrapper
- **State Management**: React hooks with localStorage persistence

## Prerequisites

- **Java 17+** (JDK)
- **Maven 3.6+** (or use included Maven wrapper)
- **Node.js 18+** and npm
- **PostgreSQL 12+** (for production) or use H2 for development

## Quick Start

### Option 1: Using H2 Database (Development - Already Configured)

1. **Clone the repository**
   ```bash
   git clone git@github.com:Sungchunn/Rakta-Junior-Dev-Webapp.git
   cd Rakta-Junior-Dev-Webapp
   ```

2. **Start the backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   Backend will start on `http://localhost:8080` with H2 in-memory database.

3. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will start on `http://localhost:3000`.

4. **Access the application**
   - Open `http://localhost:3000` in your browser
   - Register a new account to get started

### Option 2: Using PostgreSQL Database (Production)

1. **Create PostgreSQL database**
   ```bash
   createdb rakta
   ```

2. **Configure backend**
   - Edit `backend/src/main/resources/application.yml`
   - Uncomment PostgreSQL configuration
   - Comment out H2 configuration
   - Update database credentials:
     ```yaml
     spring:
       datasource:
         url: jdbc:postgresql://localhost:5432/rakta
         username: your_username
         password: your_password
     ```

3. **Enable Flyway migrations**
   - In `application.yml`, set:
     ```yaml
     spring:
       flyway:
         enabled: true
         locations: classpath:db/migration
       jpa:
         hibernate:
           ddl-auto: validate
     ```

4. **Uncomment PostgreSQL dependency** in `backend/pom.xml` (lines 75-79)

5. **Run migrations and start backend**
   ```bash
   cd backend
   ./mvnw flyway:migrate
   ./mvnw spring-boot:run
   ```

6. **Start frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Features

### Authentication & User Management
- **User Registration**: Create account with profile information (name, email, age, gender, weight, city)
- **Secure Login**: JWT token-based authentication with BCrypt password hashing
- **Protected Routes**: Secure API endpoints requiring authentication

### Donation Tracking
- **Log Donations**: Record blood donations with date, type (whole blood, platelets, plasma), and notes
- **Donation History**: View complete donation history sorted by date
- **Eligibility Calculator**: Real-time calculation based on 56-day waiting period
- **Countdown Timer**: Visual countdown showing days until next eligible donation
- **Location Linking**: Optionally link donations to specific donation centers

### Health Monitoring
- **Daily Health Logs**: Track sleep hours and daily feeling status
- **Health Status Tracking**: Monitor patterns (GREAT, GOOD, OKAY, TIRED, SICK)
- **One Entry Per Day**: Automatic updates if logging multiple times per day
- **Historical Trends**: View past health logs to identify patterns

### Donation Centers
- **Browse Locations**: Searchable list of donation centers and hospitals
- **Location Details**: Name, type, address, contact information, operating hours
- **Geographic Data**: Latitude/longitude coordinates for map integration
- **Public Access**: Available without authentication

### Dashboard
- **Personalized Welcome**: User-specific greeting and profile information
- **Eligibility Widget**: Real-time donation eligibility status
- **Recent Donations**: Quick view of donation history
- **Health Log Interface**: Easy daily health tracking
- **Readiness Guidance**: Tips for maintaining donation readiness
- **Milestone Tracking**: Achievement badges and progress indicators

## Project Structure

```
Rakta Webapp/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/rakta/
│   │   ├── controller/               # REST endpoints (4 controllers)
│   │   │   ├── AuthController.java
│   │   │   ├── DonationController.java
│   │   │   ├── HealthController.java
│   │   │   └── LocationController.java
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── entity/                   # JPA entities (4 models)
│   │   │   ├── User.java
│   │   │   ├── Donation.java
│   │   │   ├── DonationLocation.java
│   │   │   └── HealthLog.java
│   │   ├── repository/               # Spring Data repositories
│   │   ├── security/                 # JWT & Spring Security config
│   │   └── service/                  # Business logic
│   ├── src/main/resources/
│   │   ├── application.yml           # Spring Boot configuration
│   │   └── db/migration/             # Flyway SQL migrations (5 scripts)
│   └── pom.xml
│
├── frontend/                         # Next.js application
│   ├── src/
│   │   ├── app/                      # App Router pages
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── auth/                 # Login & register
│   │   │   ├── dashboard/            # User dashboard
│   │   │   ├── donate/               # Donation logging
│   │   │   └── locations/            # Centers list
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── EligibilityCountdown.tsx
│   │   │   ├── DonationList.tsx
│   │   │   ├── HealthLog.tsx
│   │   │   ├── ReadinessGuidance.tsx
│   │   │   └── MilestoneCard.tsx
│   │   └── lib/
│   │       └── api.ts                # API client wrapper
│   └── package.json
│
└── Task/                             # Project requirements
    └── Rakta Junior Software Engineer Technical Challenge.md
```

## Database Schema

### Tables

#### `users`
Stores user profiles and authentication data.
- **Columns**: id (PK), name, email (unique), password (hashed), age, gender, weight, blood_type, city
- **Timestamps**: created_at, updated_at

#### `donations`
Tracks individual blood donation records.
- **Columns**: id (PK), user_id (FK), location_id (FK, nullable), donation_date, donation_type, notes
- **Timestamps**: created_at
- **Foreign Keys**: user_id → users.id, location_id → donation_locations.id

#### `health_logs`
Daily health status entries.
- **Columns**: id (PK), user_id (FK), date, sleep_hours, feeling
- **Timestamps**: created_at
- **Constraints**: UNIQUE(user_id, date) - one log per day per user
- **Foreign Keys**: user_id → users.id

#### `donation_locations`
Database of donation centers and hospitals.
- **Columns**: id (PK), name, type, address, latitude, longitude, contact_info, opening_hours
- **No foreign keys** (reference data)

### Migrations
Located in `backend/src/main/resources/db/migration/`:
- `V1__Create_users_table.sql` - Initialize users table
- `V2__Create_donation_locations_table.sql` - Create locations table
- `V3__Create_donations_table.sql` - Create donations with foreign keys
- `V4__Insert_sample_locations.sql` - Seed initial location data
- `V5__Create_health_logs_table.sql` - Create health logs table

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and receive JWT token

### Donations (Protected - Requires JWT)
- `GET /api/donations` - Get current user's donation history
- `POST /api/donations` - Log a new donation
- `GET /api/donations/eligibility` - Check donation eligibility status

### Health Logs (Protected - Requires JWT)
- `GET /api/health` - Get user's health log history
- `POST /api/health` - Create or update today's health log

### Locations (Public)
- `GET /api/locations` - Get all donation centers
- `POST /api/locations` - Add new donation center (admin-like)

For detailed API documentation with request/response examples, see [docs/API.md](docs/API.md).

## Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory (see `.env.example`):
```properties
JWT_SECRET=your-secret-key-here-minimum-32-characters
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/rakta
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

### Frontend Environment Variables
Create a `.env.local` file in the `frontend` directory (see `.env.example`):
```properties
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Development

### Backend Hot Reload
```bash
cd backend
./mvnw spring-boot:run
# Changes to Java files will trigger automatic restart
```

### Frontend Hot Reload
```bash
cd frontend
npm run dev
# Changes automatically refresh in browser
```

### Code Style Guidelines
- **Backend**: Follow Spring Boot conventions, use Lombok annotations to reduce boilerplate
- **Frontend**: Follow Next.js and React best practices, use TypeScript strict mode
- **Formatting**: Consistent indentation (2 spaces for frontend, 4 for backend)
- **Naming**: camelCase for Java methods, kebab-case for URLs, PascalCase for React components

## Testing

### Backend Tests
```bash
cd backend
./mvnw test
# Run specific test class
./mvnw test -Dtest=AuthControllerTest
```

### Frontend Tests
```bash
cd frontend
npm test
# Run with coverage
npm test -- --coverage
```

## Deployment

### Backend Deployment (Production)
1. **Build production JAR**
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```
   Output: `target/rakta-0.0.1-SNAPSHOT.jar`

2. **Set environment variables** (Railway, Heroku, AWS, etc.)
   ```bash
   JWT_SECRET=your-production-secret
   SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/rakta
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   ```

3. **Run the JAR**
   ```bash
   java -jar target/rakta-0.0.1-SNAPSHOT.jar
   ```

4. **Database setup**
   - Ensure PostgreSQL is accessible from deployment environment
   - Run Flyway migrations on first deployment
   - Set `spring.jpa.hibernate.ddl-auto=validate` in production

### Frontend Deployment (Vercel/Netlify)
1. **Build production bundle**
   ```bash
   cd frontend
   npm run build
   npm start  # To test locally
   ```

2. **Deploy to Vercel** (recommended for Next.js)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Configure environment variables** in Vercel dashboard
   - `NEXT_PUBLIC_API_URL` → Your backend URL

4. **Alternative: Self-hosted**
   ```bash
   npm run build
   npm start
   # Runs on port 3000 by default
   ```

## Security Features

- **Password Hashing**: BCrypt with configurable strength
- **JWT Tokens**: Secure token generation with expiration
- **Input Validation**: Bean Validation (JSR-380) on all DTOs
- **SQL Injection Prevention**: JPA parameterized queries
- **XSS Protection**: React's built-in escaping, Content Security Policy
- **CORS Configuration**: Configurable allowed origins
- **Authentication Required**: Protected routes require valid JWT

## Troubleshooting

### Backend won't start
- Check Java version: `java -version` (must be 17+)
- Verify database connection in `application.yml`
- Check if port 8080 is available: `lsof -i :8080`

### Frontend won't connect to backend
- Verify backend is running: `curl http://localhost:8080/api/locations`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Database migration issues
- Ensure Flyway is enabled in `application.yml`
- Check migration file syntax
- Verify database connection credentials
- Use `./mvnw flyway:repair` if migrations are out of sync

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes with descriptive commits
4. Write tests for new functionality
5. Ensure all tests pass: `./mvnw test` and `npm test`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request with a clear description

## Future Roadmap

- [ ] Mobile responsive design improvements
- [ ] Email notifications for donation eligibility
- [ ] Interactive map for donation centers (Google Maps integration)
- [ ] Export donation history (PDF/CSV format)
- [ ] Admin dashboard for location management
- [ ] Blood type compatibility checker
- [ ] Social sharing features and achievements
- [ ] Integration with health wearables (Apple Health, Google Fit)
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme

## License

This project is part of a technical challenge submission and is provided for educational purposes.

## Support & Contact

For issues, questions, or contributions:
- Open an issue on GitHub
- Submit a pull request
- Contact: [Your contact information]

---

**Built with dedication to support blood donors and save lives.**
