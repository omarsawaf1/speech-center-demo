# Speech & Communication Therapy Center Management System (Interactive Prototype)
### مركز التخاطب والتنمية — النموذج التفاعلي لاكتشاف المتطلبات

An interactive, frontend-only prototype designed for a speech and communication therapy center (مركز تخاطب) based in Egypt.

> **Important Note:** This is an interactive prototype specifically created for **requirements discovery and workflow exploration**. The center has not opened yet, and the exact business rules (staff-to-child ratios, payment plans, cancellation rules, session limits) are intentionally kept flexible so stakeholders can visually evaluate proposed workflows before the production backend and database are engineered.

---

## Key Highlights

- **Arabic-First with English Support:**
  - Modern Standard Arabic (MSA) with Egyptian clinic terminology is the default language.
  - Full RTL (Right-to-Left) and LTR (Left-to-Right) dynamic switching via `<html dir="...">` and `<html lang="...">`.
  - Built with responsive CSS logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) on a single shared codebase.
- **Client-Side Interactive State & Persistence:**
  - Centralized mock database and store using React Context and `useReducer`.
  - Automatic, instant synchronization with `localStorage` (`speech_center_mock_state_v1`).
  - No artificial latency on CRUD operations—actions reflect instantly across all pages (e.g. marking attendance updates the dashboard statistics immediately).
  - Built-in **"Reset Demo Data"** action in Settings to restore the original fictional Egyptian dataset at any time before client presentations.
- **Mock Service Abstraction Layer:**
  - UI components communicate through clean Promise-based services (`childService`, `appointmentService`, `attendanceService`, etc.) rather than manipulating raw arrays, ensuring a direct path to API replacement later.
- **Mock Persona & Role Demonstration:**
  - Includes a non-intrusive role switcher (`ADMINISTRATOR`, `RECEPTIONIST`, `THERAPIST`, `PARENT`) to demonstrate how navigation and information access adapt across different center roles.
- **GitHub Pages Ready:**
  - Configured with `HashRouter` (`#/dashboard`, `#/children`, `#/calendar`) and relative base assets (`./assets/...`) to guarantee static hosting without 404 routing errors on page refresh.

---

## Tech Stack

| Tool / Library | Role |
| --- | --- |
| **React 18** | UI component architecture |
| **TypeScript** | Strict type safety and data modeling |
| **Vite** | Fast development server and production bundler |
| **Tailwind CSS** | Styling, RTL logical spacing, and professional clinic theme |
| **React Router v7** | Client-side routing with `HashRouter` |
| **react-i18next** | Localization with `ar.json` and `en.json` |
| **Zod** | Schema definition and form input validation |
| **Lucide React** | Consistent, accessible iconography |

---

## Project Structure

```
speech-center-demo/
├── docs/
│   └── UNKNOWN_DECISIONS.md     # Record of unresolved business questions for client workshops
├── src/
│   ├── components/              # Shell primitives (Sidebar, Topbar, MockRoleBanner, Card, Badge, Button)
│   ├── layouts/                 # DashboardLayout with responsive mobile navigation drawer
│   ├── pages/                   # Feature views (Dashboard, Children, Staff, Appointments, Calendar, Attendance, Payments, Sessions, Settings, etc.)
│   ├── mockDatabase/            # Coherent, relational fictional Egyptian demo data
│   ├── mockServices/            # Service abstraction layer (Promise-based API interface)
│   ├── state/                   # AppContext, useReducer, and localStorage synchronization
│   ├── types/                   # Zod schemas, domain models, and role definitions
│   ├── i18n/                    # Localization config and translation dictionaries (ar.json, en.json)
│   ├── lib/                     # Utilities (cn, currency formatting in EGP, date/time formatters)
│   ├── App.tsx                  # HashRouter route configuration
│   └── main.tsx                 # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Getting Started

### Prerequisites
- Node.js (v20+ or v22+)
- npm

### Installation & Running Locally

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. Build for production:
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in the `dist/` directory.

4. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## Unresolved Business Decisions

All open business requirements (such as session duration interpretations, co-therapy ratios, cancellation terms, and package billing options) are explicitly tracked in [`docs/UNKNOWN_DECISIONS.md`](./docs/UNKNOWN_DECISIONS.md).

---

## License

Private repository — created for the Speech & Communication Therapy Center demo.