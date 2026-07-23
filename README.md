## Mahadev Enterprise — Office Management System

Internal web application for managing employees, attendance, field visits, and leave workflows at Mahadev Enterprise.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Bundler | Vite 8 (Oxc transform) |
| Linting | Oxlint (type-aware) |
| Styling | Vanilla CSS with design tokens |
| State (global) | Zustand *(Step 2)* |
| State (server) | TanStack Query *(Step 2)* |
| Routing | React Router v7 *(Step 2)* |
| Forms | React Hook Form + Zod *(Step 2)* |
| Icons | Lucide React *(Step 2)* |

---

## Project Structure

```
src/
├── assets/              Static images and brand assets
├── components/
│   ├── ui/              Atomic UI components (Button, Badge, Modal…)
│   └── layout/          Layout shell (MainLayout, Sidebar, Topbar)
├── hooks/               Custom React hooks
├── modules/             Feature slices — self-contained business logic
│   ├── auth/
│   ├── dashboard/
│   ├── employees/
│   ├── attendance/
│   ├── field-visits/
│   └── leaves/
├── pages/               Thin route-entry wrappers
├── routes/              AppRoutes + ProtectedRoute
├── services/            API client, mock data, storage helpers
├── stores/              Zustand global state stores
├── types/               Shared TypeScript types and interfaces
└── utils/               Pure utility functions
```

---

## Local Development

```bash
npm install
npm run dev        # starts at http://localhost:5173
```

```bash
npm run lint       # run oxlint
npm run build      # production build (tsc + vite build)
npm run preview    # preview the production build
```

---

## Modules

| Module | Description |
|---|---|
| **Auth** | Login, session, role-based access |
| **Dashboard** | Overview stats, activity, quick actions |
| **Employees** | Employee profiles, add/edit/deactivate |
| **Attendance** | Punch in/out, leave requests, records |
| **Field Visits** | Assign, track, and complete field visits |
| **Leaves** | Leave applications and approval workflow |
