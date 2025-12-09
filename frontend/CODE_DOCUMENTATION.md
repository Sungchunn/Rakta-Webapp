# Rakta Frontend Code Documentation

This document provides a detailed technical overview of the Rakta frontend codebase, explaining the purpose of each file and the responsibilities of key functions.

## 📂 Directory Structure Overview

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router (Pages & Layouts)
│   │   ├── (platform)/      # Protected "Command Center" Application
│   │   ├── auth/            # Public Authentication Pages
│   ├── components/          # Reusable React Components
│   │   ├── layout/          # App Shell (Sidebars, Navigation)
│   │   ├── dashboard/       # Dashboard Widgets (Charts, Gauges)
│   │   ├── ui/              # Base UI Library (Buttons, Inputs)
│   ├── lib/                 # Utilities & API Clients
```

---

## 🚀 App Router (`src/app`)

### Root
- **`page.tsx`**: The entry point.
    - *Responsibility*: Currently configured to redirect authenticated users to `/dashboard` or public users to `/auth/login` (logic pending, currently forces dashboard redirect for demo).
- **`layout.tsx`**: Root layout.
    - *Responsibility*: Applies global providers (Theme, Fonts) and CSS.
- **`globals.css`**: Global styles.
    - *Responsibility*: Tailwind directives, CSS variables for "Plasma & Void" theme, custom scrollbar styles.

### `(platform)` Group
* Protected routes for the main application. Shares a specific layout.*

- **`layout.tsx`**: **Command Center Layout Controller**.
    - *Responsibility*: Renders the 3-column desktop layout.
    - *Structure*: `[AppSidebar] [Main Content] [AICopilotSidebar]`.
- **`dashboard/page.tsx`**: **Main Dashboard**.
    - *Responsibility*: Renders the "Bento Grid" view of user status.
    - *Key Features*: Integrates `RadialSeparator`, `RecoveryTrendChart`, and `DailyCheckIn`.
- **`map/page.tsx`**: **Donation Center Locator**.
    - *Responsibility*: Renders the Split-View layout (List on left, Map on right).
    - *State*: Manages `hoveredId` state to coordinate highlighting between the list items and map markers.
- **`history/page.tsx`**: **Donation Logs**.
    - *Responsibility*: Displays user donation history in a sortable, filterable Data Table.

### `auth` Group
* Public routes for user onboarding.*

- **`login/page.tsx`**: Login form.
- **`register/page.tsx`**: Registration form.

---

## 🧩 Components (`src/components`)

### `layout/`
- **`AppSidebar.tsx`**: Left Navigation Sidebar.
    - *Responsibility*: Displays app branding, navigation links (Dashboard, Map, History), and user profile summary.
- **`AICopilotSidebar.tsx`**: Right AI Assistant Sidebar.
    - *Responsibility*: Collapsible chat interface for the AI Physiology Coach.
    - *State*: Manages open/close state and chat message history.

### `dashboard/`
- **`RadialSeparator.tsx`**: **Readiness Gauge**.
    - *Responsibility*: Visualizes the user's "Readiness Score" (0-100%) using a segmented SVG ring.
    - *Props*: `score` (number), `status` (string).
- **`RecoveryTrendChart.tsx`**: **Trend Analysis**.
    - *Responsibility*: Renders a line chart using `Recharts` to show recovery velocity over the last 30 days.
- **`DailyCheckIn.tsx`**: **Quick Log Widget**.
    - *Responsibility*: Provides a specific UI for users to log their daily sleep and iron intake.

### `tracking/`
- **`DonationForm.tsx`**: Input form for recording new donations.
- **`EligibilityCountdown.tsx`**: Visual countdown timer to next eligible date.

### Root Components
- **`DonationMap.tsx`**: **Interactive Map**.
    - *Responsibility*: Renders a Leaflet map with donation center markers.
    - *Key Functions*:
        - `createBeaconIcon(id)`: Generates a custom CSS "beacon" marker. Scales up if the marker ID matches the `hoveredId` prop.
    - *Props*: `hoveredId` (for hover interactivity from the parent page).

### `ui/`
*Reusable base components styled with Tailwind CSS (based on Shadcn/ui).*
- `button.tsx`: Standard buttons.
- `card.tsx`: Container components.
- `bento-grid.tsx`: Grid layout primitives for the dashboard.
- `table.tsx`: Data table primitives for the history page.

---

## 🛠️ Utilities (`src/lib`)

- **`api.ts`**: **API Client Wrapper**.
    - *Responsibility*: Standardizes HTTP requests to the backend.
    - *Features*: Automatically injects `Authorization` header with JWT token from `localStorage`.
- **`utils.ts`**: Helper functions.

## 🔧 How to Extend & Modify

### 1. Adjusting the Dashboard Layout
- **File**: `src/app/(platform)/dashboard/page.tsx`
- **Method**: The dashboard uses a CSS Grid (`grid-cols-1 md:grid-cols-3`).
- **To Modify**:
    - Change `grid-cols-3` to `grid-cols-4` for more density.
    - Add new `div` blocks with `md:col-span-X` to create new widgets.
    - Import new components from `src/components/dashboard/`.

### 2. Adding a New Chart
- **Step 1**: Create component in `src/components/dashboard/MyNewChart.tsx`.
- **Step 2**: Use `Recharts` (already installed) or another library.
- **Step 3**: Import and place it in `dashboard/page.tsx`.

### 3. Customizing the Theme
- **File**: `src/app/globals.css`
- **Method**: Modify CSS variables in `:root`.
    - `--primary`: Changes the main accent color (currently Neon Red #EF4444).
    - `--background`: Changes the page background (currently Deep Gunmetal #09090B).

### 4. modifying Application Logic
- **Authentication**: `src/lib/api.ts` handles token storage and injection. Modify `apiRequest` to change auth headers.
- **State**: Currently uses local state (`useState`). For global state, consider adding React Context or Redux in `src/app/layout.tsx`.
