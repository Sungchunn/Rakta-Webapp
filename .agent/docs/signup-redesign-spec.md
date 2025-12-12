# Signup Form Redesign Specification

## 🎯 Design Philosophy

Transform the existing dense, single-page signup form into a **premium, multi-step wizard** that reduces cognitive load, improves accessibility, and creates a delightful user experience while maintaining the dark theme and red accent branding.

---

## 📐 Architecture: Multi-Step Wizard

### Step Structure
Instead of showing all 13+ fields at once, break the form into **3 logical steps**:

| Step | Name | Fields | Purpose |
|------|------|--------|---------|
| **1** | Account | First Name, Last Name, Email, Password, Confirm Password | Core credentials |
| **2** | Contact | Phone (with country code), City | Location & contact |
| **3** | Health | Date of Birth, Gender, Height, Weight, Blood Type | Donation-relevant data |

### Step Indicator Design
```
○───●───○
1   2   3
```
- **Active step**: Solid red circle (#DC2626) with step number in white
- **Completed step**: Red checkmark icon
- **Future step**: Zinc-700 hollow circle
- **Connector lines**: Zinc-800, turn red when completed

---

## 🎨 Visual Design System

### Color Palette (Refined)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#000000` | Page background |
| `--bg-card` | `linear-gradient(180deg, #0A0A0A, #18181B)` | Card background |
| `--bg-input` | `#0F0F0F` | Input field background |
| `--border-default` | `#27272A` | Default borders (zinc-800) |
| `--border-focus` | `#DC2626` | Focus state border |
| `--accent` | `#DC2626` | Primary red accent |
| `--accent-glow` | `rgba(220, 38, 38, 0.15)` | Focus glow effect |
| `--text-primary` | `#FFFFFF` | Labels, headings |
| `--text-secondary` | `#A1A1AA` | Hints, placeholders (zinc-400) |
| `--text-muted` | `#71717A` | Subtle text (zinc-500) |

### Typography Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Title | 32px (2rem) | Bold (700) | 1.2 |
| Subtitle | 16px (1rem) | Normal (400) | 1.5 |
| Section Header | 14px (0.875rem) | Semibold (600) | 1.4 |
| Label | 14px (0.875rem) | Medium (500) | 1 |
| Input Text | 16px (1rem) | Normal (400) | 1.5 |
| Helper Text | 12px (0.75rem) | Normal (400) | 1.4 |

---

## 📦 Card Container

### Dimensions & Spacing
```css
.signup-card {
  max-width: 520px;          /* Narrower for focus */
  padding: 48px;             /* Generous internal spacing */
  border-radius: 24px;       /* Softer corners */
  background: linear-gradient(180deg, #0A0A0A 0%, #18181B 100%);
  border: 1px solid #27272A;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03);
}

.signup-card:hover {
  border-color: rgba(220, 38, 38, 0.3);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(220, 38, 38, 0.1);
}
```

---

## 🔤 Input Field Design

### Standard Input
```css
.input-field {
  height: 56px;              /* Larger touch target */
  padding: 16px 20px;
  font-size: 16px;           /* Prevents iOS zoom */
  border-radius: 12px;
  background: #0F0F0F;
  border: 1px solid #27272A;
  color: white;
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: #DC2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
  outline: none;
}

.input-field::placeholder {
  color: #71717A;
}
```

### Floating Labels
Implement floating labels that animate from placeholder position to above the input:

```
┌──────────────────────────┐
│ Email                    │  ← Label floats up on focus/filled
│ john@example.com         │
└──────────────────────────┘
```

### Input with Icon
For email and phone fields, include left-aligned icons:
```
┌─────────────────────────────────┐
│ ✉️ │ john@example.com           │
└─────────────────────────────────┘
     └── 20px padding from icon
```

---

## 📱 Phone Number Field (Integrated Design)

Replace the separate country code dropdown with an integrated design:

```
┌───────────────────────────────────────────┐
│ 🇹🇭 +66 ▾ │ 812 345 678                   │
└───────────────────────────────────────────┘
     │            │
     │            └── Phone number (auto-formatted)
     └── Country selector (dropdown on click)
```

### Implementation Details
- Country code section: Fixed width (110px), subtle right border separator
- Flag emoji + code displayed
- Dropdown shows: `🇹🇭 Thailand (+66)` format
- Phone input: Auto-format as user types (e.g., `812 345 678`)

---

## 📅 Date of Birth Picker (Modern Calendar)

### Trigger Button Design
```
┌─────────────────────────────────────────┐
│ 📅 │ Select your birthday              │
└─────────────────────────────────────────┘
```

After selection:
```
┌─────────────────────────────────────────┐
│ 📅 │ January 15, 1995                   │
└─────────────────────────────────────────┘
```

### Calendar Popup Improvements
- Dark theme matching card background
- Month/Year dropdowns for quick navigation (especially for birth dates)
- Red accent for selected date
- Today indicator
- Age validation hint: "Must be 16+ to donate"

---

## 🔘 Select Dropdowns (Gender, Blood Type)

### Trigger Design
```
┌─────────────────────────────────────────┐
│ Select gender                    ▾      │
└─────────────────────────────────────────┘
```

### Dropdown Content
- Dark background (#18181B)
- Each option: 48px height, hover: rgba(220,38,38,0.1) background
- Selected item: Red checkmark on right
- Smooth animation (slideDown + fade)

### Blood Type Enhancement
Add visual blood drop icons:
```
🩸 A+    🩸 A-
🩸 B+    🩸 B-
🩸 AB+   🩸 AB-
🩸 O+    🩸 O-
```

---

## 📏 Height & Weight Fields

### Design with Units
```
┌──────────────────┐  ┌──────────────────┐
│ 170         │ cm │  │ 65          │ kg │
└──────────────────┘  └──────────────────┘
```

- Number input with unit suffix inside the field
- Use `inputmode="decimal"` for mobile keyboard
- Optional: Slider for visual selection
- Show BMI calculation hint below: "BMI: 22.5 (Healthy)"

---

## ☑️ Terms Checkbox (Improved)

### Current Issue
Small checkbox, cramped text, hard to tap on mobile.

### Redesigned Version
```
┌─────────────────────────────────────────────────────┐
│ ┌───┐                                               │
│ │ ✓ │  I accept the terms and conditions and       │
│ └───┘  consent to blood donation eligibility       │
│        tracking.                                   │
│                                                    │
│        View Terms →                                │
└─────────────────────────────────────────────────────┘
```

- Larger checkbox: 24px × 24px
- Better spacing: 16px gap between checkbox and text
- "View Terms" as a subtle secondary link
- Entire row is clickable
- Checked state: Red background, white checkmark

---

## 🔴 Submit Button (CTA Enhancement)

### Design
```css
.submit-button {
  width: 100%;
  height: 56px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### Button States by Step
- Step 1-2: "Continue →"
- Step 3: "Create Account"
- Loading: Spinner + "Creating Account..."

---

## 🔄 Step Navigation

### Back Button
- Text button on the left: "← Back"
- Only visible on steps 2 and 3
- Zinc-400 color, hover: white

### Progress Retention
- Form data persists between steps
- User can navigate back without losing data
- Visual indicator of completed fields

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Card: Full width with 24px margin
- Padding: 24px (reduced from 48px)
- Stacked fields (no side-by-side)
- Larger touch targets (min 48px)

### Tablet (640px - 1024px)
- Card: max-width 480px
- Side-by-side fields where appropriate

### Desktop (> 1024px)
- Card: max-width 520px
- All design as specified

---

## ✨ Micro-Interactions

1. **Input Focus**: Subtle border color transition + glow effect
2. **Button Hover**: Lift effect + shadow intensification
3. **Step Transition**: Slide animation between steps
4. **Validation Feedback**: Shake animation on error, green checkmark on valid
5. **Password Strength**: Real-time strength meter below password field
6. **Success State**: Confetti/celebration animation on account creation

---

## 🧪 Accessibility Checklist

- [ ] All inputs have associated labels (not just placeholders)
- [ ] Focus states are clearly visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Touch targets are minimum 48px
- [ ] Error messages are announced to screen readers
- [ ] Form can be navigated entirely by keyboard
- [ ] Step indicators have aria-labels

---

## 📊 Before vs After Comparison

| Aspect | Before | After |
|--------|--------|-------|
| Fields visible | 13+ at once | 5-6 per step |
| Card padding | ~32px | 48px |
| Input height | ~40px | 56px |
| Checkbox size | 16px | 24px |
| Button height | ~40px | 56px |
| Visual hierarchy | Flat | Clear sections |
| Cognitive load | High | Low (chunked) |
| Mobile UX | Cramped | Spacious |

---

This specification provides a complete blueprint for implementing a premium, user-friendly signup experience that respects the existing dark theme while dramatically improving usability and visual appeal.
