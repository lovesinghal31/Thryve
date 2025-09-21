# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


# Admin Site

React 18 + Vite + Tailwind admin panel with JWT auth, React Router, React Query, and Axios interceptors.

## Setup

1. Copy `.env.sample` to `.env` and set your API base URL:

```
VITE_API_BASE=http://localhost:5000/api/v1
```

2. Install dependencies:

```
npm install
```

3. Run dev server:

```
npm run dev
```

4. Build for production:

```
npm run build
```

## Routes

- `/admin/login` — Admin login
- `/admin/signup` — Admin signup with OTP
- Protected under `/admin/*` — Dashboard, Users, Institutes, etc.

## Notes

- Tokens are stored in memory and persisted to `localStorage` for session continuity.
- Axios auto-injects `Authorization: Bearer` and refreshes tokens on `401` via `/users/refresh-token`.
- Dashboard endpoint tries `/admin-dashboard/admin-dashboard` then falls back to `/admin-dashboard`.
