# Frontend Design Specification: Donor Readiness Engine & New Features

**Context**: We are building a "Donor Readiness Engine" that calculates a daily score (0-100%) to tell blood donors if they are physically and physiologically ready to donate. We are also adding AI coaching, auto-sync, and community features.

## 1. Data Models (TypeScript Interfaces)

Use these exact interfaces to ensure compatibility with the backend API.

```typescript
// The raw metrics a user inputs daily
interface DailyMetricDto {
  date: string;             // YYYY-MM-DD
  sleepHours: number;       // e.g., 7.5
  sleepEfficiency: number;  // 0-100 (percentage)
  trainingLoadAcute: number;// 0-10 (self-reported intensity)
  restingHeartRate: number; // BPM (e.g., 60)
  hrvMs: number;            // Heart Rate Variability in ms (e.g., 50)
  ironIntakeScore: number;  // 1-5 (1=Poor, 5=Excellent)
  energyLevel: number;      // 1-5 (1=Exhausted, 5=Great)
  hydrationLiters: number;  // e.g., 2.5
  menstrualCycleDay?: number; // Optional, 1-28
  source: 'MANUAL' | 'APPLE_HEALTH' | 'GARMIN';
}

// The calculated result returned by the backend
interface ReadinessSnapshot {
  score: number;            // 0-100 (The main readiness score)
  status: 'OPTIMAL' | 'GOOD' | 'FAIR' | 'LOW';
  breakdown: {
    physical_recovery: number;   // 0-100 (Combined RBC + Iron recovery)
    lifestyle_readiness: number; // 0-100 (Sleep + Stress/Load)
  };
  recommendation: string;   // Personalized text (e.g., "Boost your iron intake...")
}
```

## 2. API Endpoints

### A. Submit Daily Metrics
*   **Endpoint**: `POST /api/v1/health/daily`
*   **Purpose**: User logs their health data for the day.
*   **Input**: `DailyMetricDto`
*   **Response**: Returns the calculated `ReadinessSnapshot` immediately.

### B. Get Current Readiness
*   **Endpoint**: `GET /api/v1/readiness/current`
*   **Purpose**: Fetch the latest calculated score to display on the dashboard.
*   **Response**: `ReadinessSnapshot` JSON structure.

## 3. UI Requirements & Logic

### Dashboard Widget (Readiness Score)
*   **Visual**: A circular gauge or progress ring displaying the `score` (0-100).
*   **Color Coding**:
    *   **OPTIMAL (85-100)**: Green
    *   **GOOD (70-84)**: Blue
    *   **FAIR (50-69)**: Orange
    *   **LOW (0-49)**: Red
*   **Breakdown**: Display two sub-bars or indicators for:
    1.  **Physical Recovery**: How well their body has recovered (Iron/RBC).
    2.  **Lifestyle**: How well they slept and managed stress recently.
*   **Recommendation**: Display the `recommendation` string prominently (e.g., inside a tip box).

### Input Form (Daily Check-in)
*   **Fields Required**:
    *   **Sleep**: Number input (Hours) + Number input (Efficiency %).
    *   **Heart Health**: Number input (RHR) + Number input (HRV).
    *   **Activity**: Slider or Select (0-10) for Training Load.
    *   **Nutrition**: Rating (1-5 stars/icons) for Iron Intake.
    *   **Energy**: Rating (1-5 stars/icons) for Energy Level.
    *   **Hydration**: Number input (Liters).
    *   **Cycle**: Number input (Day of cycle, optional).
*   **Interaction**:
    *   On submit, send POST request.
    *   On success, trigger a refresh of the Dashboard Widget to show the new score.

## 4. Design Guidelines
*   **Aesthetics**: Clean, modern, medical-tech vibe. Use whitespace effectively.
*   **Mobile-First**: Inputs should be touch-friendly (sliders, big buttons).
*   **Feedback**: Immediate visual feedback when the score updates after submission.

## 5. New Feature: AI Personal Physiology Coach
*   **Endpoint**: `POST /api/v1/coach/sessions/{sessionId}/messages`
*   **UI**: A chat interface where users can ask questions like "Am I ready to donate?".
*   **Logic**: Display user messages on the right, AI responses on the left.
*   **Data**:
    ```typescript
    interface ChatMessage {
      id: string;
      sender: 'USER' | 'AI';
      content: string;
      createdAt: string;
    }
    ```

## 6. New Feature: Auto-Sync & Integrations
*   **Endpoint**: `POST /api/v1/integrations/connect`
*   **UI**: A settings page with "Connect" buttons for Apple Health, Garmin, etc.
*   **Status**: Show "Connected" or "Syncing..." status.

## 7. New Feature: One-Tap Supplement Log
*   **Endpoint**: `POST /api/v1/integrations/supplements`
*   **UI**: Quick action buttons on the dashboard: "Took Iron", "Took Vitamin C".
*   **Feedback**: Toast notification "Supplement logged!".

## 8. New Feature: Community
*   **Endpoint**: `POST /api/v1/community/follow/{userId}`
*   **UI**: A list of users to follow.
*   **Social**: See who you are following and who follows you.
