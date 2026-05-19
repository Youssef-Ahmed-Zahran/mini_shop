# Mini Shop — Full Stack Monorepo

> Full-stack e-commerce project: **Fastify API** · **React Admin Dashboard** · **Expo Mobile App**

---

## 🏗️ Project Structure

```
mini_shop/
├── backend/       Fastify + TypeScript + PostgreSQL (Supabase)
├── dashboard/     React + Vite + Tailwind CSS (Admin Panel)
└── mobile/        Expo SDK 55 + React Native (Customer App)
```

## 🚀 Quick Start

### 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Run `backend/supabase/schema.sql` in the **SQL Editor**
3. Copy your credentials into each `.env` file

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env        # fill in Supabase + JWT values
npm run dev                 # http://localhost:3000
npm run seed                # creates categories, products, and test accounts
```

### 3. Dashboard
```bash
cd dashboard
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:3000
npm run dev                 # http://localhost:5173
```
Login: `admin@minishop.dev` / `Admin123!`

### 4. Mobile
```bash
cd mobile
npm install
cp .env.example .env        # use your local IP, not localhost
npx expo start              # scan QR with Expo Go
```
Login: `customer@minishop.dev` / `Customer123!`

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| API | Fastify 5 · TypeScript · Zod · `pg` (node-postgres) |
| Database | Supabase PostgreSQL + RLS policies |
| Auth | Supabase Auth + JWT (`@fastify/jwt`) |
| Storage | Supabase Storage (product images) |
| Dashboard | React 18 · Vite · Tailwind CSS v4 · React Query · Zustand |
| Mobile | Expo SDK 55 · React Native · Expo Router · React Query · Zustand |

## 🏛️ Architecture Pattern

All three projects share the same **feature-based structure**:

```
features/
└── {feature}/
    ├── api/        HTTP layer (axios calls)
    ├── hooks/      React Query queries & mutations
    ├── schemas/    Zod validation schemas
    ├── components/ UI components
    └── pages/      Screen/Page components
```

**State Management split:**
- 🟣 **Zustand** — client-only state (auth session, cart, UI)
- 🔵 **React Query** — all server state (products, orders, categories)

## 🔐 Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@minishop.dev` | `Admin123!` |
| Customer | `customer@minishop.dev` | `Customer123!` |
