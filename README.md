# Rakta - Blood Donation Tracking App

A full-stack web application designed to help people build a consistent, healthy blood donation habit. Track your donation journey, monitor health readiness, connect with the community, and find nearby donation centers.

## Live Demo

**[https://rakta-frontend.onrender.com](https://rakta-frontend.onrender.com)**

## Features

### Donation Tracking
- Log blood donations with date, type, and location
- View complete donation history
- Real-time eligibility calculator (56-day waiting period)
- Countdown timer to next eligible donation

### Health Monitoring
- Daily health logs (sleep hours, feeling status)
- Advanced metrics integration (HRV, resting heart rate, training load)
- Readiness score calculation
- Wearable device sync (Apple Health, Garmin, Google Fit)

### Community
- Public activity feed with donation posts
- Follow/unfollow other donors
- Like and engage with posts
- User profiles with badges and stats

### Gamification
- Achievement badges for milestones
- Donation streaks
- Community recognition

### Donation Centers
- Browse nearby donation locations
- Interactive map view
- Location details and contact information

## Tech Stack

### Backend
- **Spring Boot 4.0** with Java 17
- **PostgreSQL** database
- **JWT** authentication with Spring Security
- **Flyway** database migrations
- **Spring Data JPA** with Hibernate

### Frontend
- **Next.js 16** with React 19
- **TypeScript**
- **Tailwind CSS** with Shadcn UI components
- **Radix UI** primitives
- **Framer Motion** animations

## Local Development

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 12+ (or use H2 for development)

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`

## Environment Variables

### Backend
```properties
JWT_SECRET=your-secret-key
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/rakta
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

### Frontend
```properties
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Deployment

Deployed on **Render** with:
- Backend: Docker container with Spring Boot
- Frontend: Static site with Next.js
- Database: PostgreSQL (Render managed)

---

**Built to support blood donors and save lives.**
