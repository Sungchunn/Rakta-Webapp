# FitSloth Frontend - Next.js Application

This is the frontend user interface for the FitSloth blood donation tracking application, built with Next.js 16.0.3, React 19.2.0, and TypeScript.

## Overview

The FitSloth frontend provides an intuitive web interface for users to:
- Register and authenticate securely
- Track their blood donation history
- Monitor donation eligibility with countdown timers
- Log daily health metrics
- Find nearby donation centers
- View personalized dashboard with guidance and milestones

## Technology Stack

- **Framework**: Next.js 16.0.3 with React 19.2.0
- **Language**: TypeScript 5.x
- **Routing**: App Router (Next.js 14+ architecture)
- **Styling**: CSS Modules for component-scoped styling
- **HTTP Client**: Fetch API with custom wrapper
- **State Management**: React hooks with localStorage persistence
- **Authentication**: JWT token-based with localStorage

## Prerequisites

- **Node.js 18+** and npm (or yarn, pnpm, bun)
- **Backend API** running on http://localhost:8080 (see [../backend/README.md](../backend/README.md))

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:

```properties
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000).

### 4. Access the Application

Open your browser to http://localhost:3000 and:
- Click "Get Started" to register a new account
- Or login if you already have an account
- Explore the dashboard and features

## Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── layout.tsx                # Root layout with Navbar
│   │   ├── globals.css               # Global styles
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── login/                # Login page
│   │   │   └── register/             # Registration page
│   │   ├── dashboard/                # User dashboard
│   │   │   └── page.tsx              # Main dashboard view
│   │   ├── donate/                   # Donation logging
│   │   │   └── page.tsx              # Donation form
│   │   └── locations/                # Donation centers
│   │       └── page.tsx              # Centers list
│   ├── components/                   # Reusable React components
│   │   ├── Navbar.tsx                # Navigation bar
│   │   ├── EligibilityCountdown.tsx  # Donation countdown widget
│   │   ├── DonationList.tsx          # Donation history list
│   │   ├── HealthLog.tsx             # Health logging form
│   │   ├── ReadinessGuidance.tsx     # Health tips widget
│   │   └── MilestoneCard.tsx         # Achievement cards
│   └── lib/
│       └── api.ts                    # API client utilities
├── public/                           # Static assets
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment (not in git)
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

## Key Files and Components

### Pages (App Router)

#### Landing Page (`src/app/page.tsx`)
- Public homepage with hero section
- Features overview
- Call-to-action buttons

#### Authentication Pages (`src/app/auth/`)
- **Login** (`auth/login/page.tsx`) - User authentication
- **Register** (`auth/register/page.tsx`) - New user registration

#### Dashboard (`src/app/dashboard/page.tsx`)
- Personalized user dashboard
- Eligibility countdown
- Donation history
- Health log interface
- Readiness guidance
- Milestone tracking

#### Donation Form (`src/app/donate/page.tsx`)
- Log new blood donation
- Select donation type (whole blood, platelets, plasma)
- Optional location and notes

#### Locations List (`src/app/locations/page.tsx`)
- Browse donation centers and hospitals
- View contact information and hours

### Reusable Components

#### Navbar (`src/components/Navbar.tsx`)
- Site-wide navigation
- Conditional rendering (logged in/out states)
- Logout functionality

#### EligibilityCountdown (`src/components/EligibilityCountdown.tsx`)
- Real-time countdown to next eligible donation
- Visual progress indicator
- Eligibility status message

#### DonationList (`src/components/DonationList.tsx`)
- Displays user's donation history
- Sorted by date (most recent first)
- Shows donation type, date, location, notes

#### HealthLog (`src/components/HealthLog.tsx`)
- Daily health logging form
- Sleep hours input
- Feeling status dropdown (GREAT, GOOD, OKAY, TIRED, SICK)

#### ReadinessGuidance (`src/components/ReadinessGuidance.tsx`)
- Health tips and guidance
- Donation preparation advice

#### MilestoneCard (`src/components/MilestoneCard.tsx`)
- Achievement badges
- Donation milestones display

### API Client (`src/lib/api.ts`)

Custom wrapper around Fetch API with:
- Base URL configuration from environment
- JWT token injection from localStorage
- Automatic JSON parsing
- Error handling

**Example usage:**

```typescript
import api from '@/lib/api'

// GET request
const donations = await api('/api/donations')

// POST request
await api('/api/donations', {
  method: 'POST',
  body: JSON.stringify({ donationDate: '2025-11-24', ... })
})
```

## Styling

### CSS Modules

Component-specific styles using CSS Modules:
- Scoped to individual components
- Prevents style conflicts
- Type-safe class names with TypeScript

**Example:**

```tsx
// Component.tsx
import styles from './Component.module.css'

export default function Component() {
  return <div className={styles.container}>Content</div>
}
```

### Global Styles

Global styles in `src/app/globals.css`:
- CSS reset
- Root variables (colors, fonts)
- Utility classes

## Authentication Flow

### Registration
1. User fills out registration form
2. POST to `/api/auth/register`
3. Receive JWT token and user data
4. Store token and user in localStorage
5. Redirect to dashboard

### Login
1. User enters email and password
2. POST to `/api/auth/login`
3. Receive JWT token
4. Store in localStorage
5. Redirect to dashboard

### Protected Routes
- Check localStorage for token on component mount
- Redirect to login if not authenticated
- Include token in API requests via `Authorization: Bearer {token}`

### Logout
- Clear localStorage
- Redirect to homepage

## API Integration

### Backend Connection

The frontend connects to the backend via the `NEXT_PUBLIC_API_URL` environment variable.

**Endpoints used:**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/donations` - Fetch user donations
- `POST /api/donations` - Log new donation
- `GET /api/donations/eligibility` - Check eligibility
- `GET /api/health` - Fetch health logs
- `POST /api/health` - Log daily health
- `GET /api/locations` - Fetch donation centers

See [../backend/README.md](../backend/README.md) for complete API documentation.

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run TypeScript type checking
npm run type-check

# Lint code
npm run lint
```

### Development Mode Features

- **Hot Module Replacement (HMR)** - Changes reflect immediately
- **Fast Refresh** - Preserves component state during edits
- **TypeScript Checking** - Real-time type errors in IDE
- **Error Overlay** - Helpful error messages in browser

### Adding New Pages

1. Create a new directory in `src/app/`
2. Add a `page.tsx` file
3. Export a default React component
4. Page is automatically routed based on folder name

**Example:**

```tsx
// src/app/profile/page.tsx
export default function ProfilePage() {
  return <div>User Profile</div>
}
// Accessible at: http://localhost:3000/profile
```

### Adding New Components

1. Create file in `src/components/`
2. Create corresponding CSS Module if needed
3. Export component
4. Import and use in pages

```tsx
// src/components/MyComponent.tsx
import styles from './MyComponent.module.css'

export default function MyComponent() {
  return <div className={styles.container}>Hello</div>
}
```

## Building and Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Output directory: .next/
```

### Running Production Build Locally

```bash
# Build first
npm run build

# Then start production server
npm start
```

### Deploy to Vercel (Recommended)

Vercel is the platform created by the Next.js team and offers the best experience:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**In Vercel Dashboard:**
1. Connect your GitHub repository
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` → Your production backend URL
3. Deploy automatically on git push

### Deploy to Netlify

```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
NEXT_PUBLIC_API_URL=https://your-backend.com
```

### Self-Hosted Deployment

```bash
# Build the application
npm run build

# Run with PM2 or similar
pm2 start npm --name "fitsloth-frontend" -- start

# Or use Docker
docker build -t fitsloth-frontend .
docker run -p 3000:3000 fitsloth-frontend
```

### Environment Variables for Production

Update `.env.local` or configure in your hosting platform:

```properties
NEXT_PUBLIC_API_URL=https://api.fitsloth.com
```

For Vercel, set these in: Project Settings → Environment Variables

## TypeScript Configuration

The project uses TypeScript with strict mode enabled (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Path Aliases:**
- `@/*` maps to `src/*`
- Example: `import api from '@/lib/api'`

## Testing

### Unit Tests (To Be Implemented)

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Component Testing

```tsx
// Example test file: src/components/Navbar.test.tsx
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

test('renders navbar', () => {
  render(<Navbar />)
  expect(screen.getByText('FitSloth')).toBeInTheDocument()
})
```

### E2E Testing

Consider adding Playwright or Cypress for end-to-end testing:

```bash
npm install --save-dev @playwright/test
npx playwright test
```

## Performance Optimization

### Image Optimization

Use Next.js Image component for automatic optimization:

```tsx
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  alt="Blood donation"
  width={500}
  height={300}
/>
```

### Code Splitting

Next.js automatically code-splits by route. For dynamic imports:

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

### Caching Strategy

- API responses cached in localStorage (user data)
- Use React Query or SWR for advanced caching

## Troubleshooting

### Backend Connection Issues

**Problem:** "Failed to fetch" errors

**Solutions:**
1. Verify backend is running: `curl http://localhost:8080/api/locations`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Restart dev server after changing env vars
4. Check browser console for CORS errors

### Authentication Issues

**Problem:** Redirected to login after registration

**Solutions:**
1. Check localStorage contains `token` and `user` keys
2. Verify JWT token is valid (not expired)
3. Check backend JWT secret is configured

### Styling Not Applying

**Problem:** CSS changes not reflected

**Solutions:**
1. Verify CSS Module import: `import styles from './Component.module.css'`
2. Check class name usage: `className={styles.myClass}`
3. Clear `.next` cache: `rm -rf .next && npm run dev`

### TypeScript Errors

**Problem:** Type errors in IDE or build

**Solutions:**
1. Run type check: `npm run type-check`
2. Update types: `npm install --save-dev @types/react @types/node`
3. Check `tsconfig.json` configuration

## Best Practices

### Component Structure

```tsx
// 1. Imports
import { useState, useEffect } from 'react'
import styles from './Component.module.css'

// 2. Types/Interfaces
interface Props {
  title: string
}

// 3. Component
export default function Component({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState('')

  useEffect(() => {
    // Side effects
  }, [])

  // 5. Event handlers
  const handleClick = () => {
    // Handler logic
  }

  // 6. Render
  return <div>{title}</div>
}
```

### State Management

- Use `useState` for local component state
- Use `useContext` for shared state across components
- Consider Zustand or Redux for complex global state

### Error Handling

Always handle API errors gracefully:

```tsx
try {
  const data = await api('/api/donations')
  setDonations(data)
} catch (error) {
  console.error('Failed to fetch donations:', error)
  setError('Could not load donations. Please try again.')
}
```

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

## Additional Resources

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs) - Comprehensive Next.js guide
- [App Router](https://nextjs.org/docs/app) - New routing system
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

### React Documentation
- [React Docs](https://react.dev/) - Official React documentation
- [React Hooks](https://react.dev/reference/react) - Hooks API reference

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### CSS Modules
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)

---

For backend integration details, see [../backend/README.md](../backend/README.md)

For complete project overview, see [../README.md](../README.md)
