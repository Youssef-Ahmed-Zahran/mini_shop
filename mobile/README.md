# Mini Shop — Mobile App

Expo SDK 55 · React Native · TypeScript · React Query · Zustand

## Setup

```bash
cd mobile
npm install
cp .env.example .env   # fill in your values
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `i` (iOS) / `a` (Android).

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Backend URL — use your **local IP** (e.g. `http://192.168.1.x:3000`) not localhost |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

## Test Accounts

- **Customer:** `customer@minishop.dev` / `Customer123!`
- **Admin:** `admin@minishop.dev` / `Admin123!`

## Features

- **Auth** — Login, Register, Forgot Password (Supabase email reset)
- **Shop** — Product grid with search + category filter, pull-to-refresh
- **Cart** — Add/remove/update items, quantity controls, subtotal
- **Checkout** — Place order via API with confirmation
- **Orders** — Order history with status badges, tap for detail
- **Profile** — User info + logout

## Architecture

```
app/                     ← UI layer (Expo Router)
├── (auth)/              login, register, forgot-password
├── (tabs)/              index (shop), cart, orders, profile
├── product/[id].tsx     product detail
└── order/[id].tsx       order confirmation / detail

src/                     ← Logic layer
├── features/
│   ├── auth/            (api, hooks, schemas, components)
│   ├── products/        (api, hooks, components)
│   ├── orders/          (api, hooks, components)
│   └── cart/            (hooks, components)
├── store/               (Zustand: authStore, cartStore)
├── components/          (Button, Input — shared UI)
├── config/              (apiClient)
├── lib/                 (queryClient)
└── types/
```

**State Management:**
- **React Query** → server state (products, orders)
- **Zustand** → UI state (auth token/user, cart items)
