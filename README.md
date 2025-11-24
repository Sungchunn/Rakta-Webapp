# FitSloth Blood Donation Webapp

A web application to help people build a consistent, healthy, and proud blood-donation habit.

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.x, PostgreSQL, Flyway, JWT.
- **Frontend**: Next.js 14, TypeScript, Vanilla CSS Modules.
- **Database**: PostgreSQL.

## Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL running locally (or via Docker)

## Setup & Run

### Database
1. Create a PostgreSQL database named `fitsloth`.
   ```bash
   createdb fitsloth
   ```
   (Or configure `backend/src/main/resources/application.yml` to point to your DB).

### Backend
1. Navigate to `backend` directory.
2. Run the application (this will also run Flyway migrations).
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### Frontend
1. Navigate to `frontend` directory.
2. Install dependencies.
   ```bash
   npm install
   ```
3. Run the development server.
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`.

## Features

- **User Auth**: Register and Login.
- **Dashboard**: View eligibility, donation history, and health tips.
- **Donation Tracking**: Log donations and see countdown to next eligibility.
- **Locations**: Find nearby donation centers.
- **Health Log**: Track sleep and feeling to ensure readiness.
- **Milestones**: Shareable achievements.

## Deployment

- **Backend**: Build with `./mvnw clean package`. Deploy the JAR to Railway/Heroku. Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` env vars.
- **Frontend**: Build with `npm run build`. Deploy to Vercel/Netlify. Set `NEXT_PUBLIC_API_URL` to the backend URL.

## License

MIT
