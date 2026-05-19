# Mini Shop — Full Stack Monorepo

> Full-stack e-commerce project: **Fastify API** · **React Admin Dashboard** · **Expo Mobile App**

---

## 🎥 Demo Video

Google Drive Recording:

https://drive.google.com/drive/folders/1y90KgaYjRK6lrpmYlgcVKafcCRCZhWzJ?usp=drive_link

---

## 🏗️ Project Structure

```txt
mini_shop/
├── backend/       Fastify + TypeScript + PostgreSQL (Supabase)
├── dashboard/     React + Vite + Tailwind CSS (Admin Panel)
└── mobile/        Expo SDK 55 + React Native (Customer App)
```

---

## 🚀 Quick Start

### 1. Supabase Setup

1. Create a project at https://supabase.com
2. Run `backend/supabase/schema.sql` in the SQL Editor
3. Copy your credentials into each `.env` file

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
npm run seed
```

Backend runs on:

```txt
http://localhost:3000
```

### Backend Environment Variables

```env
PORT=3000

SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_ANON_KEY=

JWT_SECRET=
```

---

### 3. Dashboard

```bash
cd dashboard
npm install
cp .env.example .env
npm run dev
```

Dashboard runs on:

```txt
http://localhost:5173
```

### Dashboard Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Admin Test Account

```txt
Email: admin@minishop.dev
Password: Admin123!
```

---

### 4. Mobile

```bash
cd mobile
npm install
cp .env.example .env
npx expo start
```

Scan the QR code using Expo Go.

### Mobile Environment Variables

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

### Customer Test Account

```txt
Email: customer@minishop.dev
Password: Customer123!
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| API | Fastify 5 · TypeScript · Zod · pg (node-postgres) |
| Database | Supabase PostgreSQL + RLS Policies |
| Auth | Supabase Auth + JWT (@fastify/jwt) |
| Storage | Supabase Storage |
| Dashboard | React 18 · Vite · Tailwind CSS v4 · React Query · Zustand |
| Mobile | Expo SDK 55 · React Native · Expo Router · React Query · Zustand |

---

## 🏛️ Architecture Pattern

All three projects share the same feature-based structure:

```txt
features/
└── {feature}/
    ├── api/        HTTP layer
    ├── hooks/      React Query hooks
    ├── schemas/    Zod validation schemas
    ├── components/ Reusable UI
    └── pages/      Screens / Pages
```

### State Management Strategy

- 🟣 Zustand → client-only state
  - authentication session
  - shopping cart
  - UI state

- 🔵 React Query → server state
  - products
  - categories
  - orders

---

## 📦 Seed Data

The seed script creates:

- 10+ products
- 3 categories
- admin account
- customer account

### Categories

- Electronics
- Fashion
- Home

---

## ✨ Features

### Customer Mobile App

- Register / Login
- Browse Products
- Product Details
- Add To Cart
- Checkout
- Place Orders
- View Order History

### Admin Dashboard

- Admin Authentication
- Product Management
- Category Management
- Order Management
- Update Order Status

### Backend API

- JWT Authentication
- Role-based Authorization
- REST API
- Input Validation using Zod
- PostgreSQL Database Integration

---

## 🧠 Technical Decision

The project uses a shared feature-based architecture across backend, dashboard, and mobile applications to improve scalability, maintainability, and code organization.

React Query was used for server state management while Zustand handles lightweight client-side state such as authentication and cart state.

---

## 👨‍💻 Author

Youssef Zahran

---
