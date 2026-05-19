# Mini Shop — Admin Dashboard

React · Vite · TypeScript · Tailwind CSS · React Query · Zustand

## Setup

```bash
cd dashboard
npm install
cp .env.example .env   # fill in your values
npm run dev
```

Open: http://localhost:5173

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (default http://localhost:3000) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

## Login

Use the admin account created by the seed script:
- **Email:** `admin@minishop.dev`
- **Password:** `Admin123!`

## Features

- **Dashboard** — KPI cards: orders today, total revenue, total orders, active products
- **Products** — CRUD table with search, image upload (Supabase Storage), toggle active/inactive
- **Orders** — Filterable table with status update and order detail modal

## Architecture

```
src/
├── features/
│   ├── auth/         (api, hooks, schemas, pages)
│   ├── products/     (api, hooks, schemas, pages)
│   ├── orders/       (api, hooks, schemas, pages)
│   └── dashboard/    (pages)
├── components/
│   └── layout/       (Sidebar, AppLayout)
├── store/            (Zustand: authStore, uiStore)
├── lib/              (queryClient)
├── router/           (ProtectedRoute)
├── config/           (apiClient)
└── types/
```

**State Management:**
- **React Query** → all server state (products, orders, categories)
- **Zustand** → UI state (auth session, sidebar open/close)
