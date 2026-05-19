# Mini Shop — Backend API

Node.js · Fastify · TypeScript · PostgreSQL (Supabase) · Supabase Storage

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default 3000) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key (bypasses RLS) |
| `JWT_SECRET` | At least 32 characters |
| `DATABASE_URL` | Supabase PostgreSQL connection string (URI mode) |
| `FRONTEND_URL` | Dashboard URL for password reset redirect |

## Database Setup

1. Go to **Supabase SQL Editor**
2. Run `supabase/schema.sql` — creates all tables, RLS policies, indexes, and the `product-images` storage bucket

## Seed Data

```bash
npm run seed
```

Creates: 3 categories, 10 products, and two test accounts:
- **Customer:** `customer@minishop.dev` / `Customer123!`
- **Admin:** `admin@minishop.dev` / `Admin123!`

## API Routes

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register |
| POST | `/auth/login` | Public | Login → JWT |
| POST | `/auth/forgot-password` | Public | Password reset |
| GET | `/auth/me` | JWT | Current profile |

### Products
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/products` | Public | List (search + category filter) |
| GET | `/products/:id` | Public | Single product |
| GET | `/categories` | Public | All categories |
| POST | `/products` | Admin | Create |
| PATCH | `/products/:id` | Admin | Update |
| DELETE | `/products/:id` | Admin | Soft-delete |

### Orders
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/orders` | JWT | Place order |
| GET | `/orders/my` | JWT | My orders |
| GET | `/orders/:id` | JWT | Order detail |
| GET | `/orders` | Admin | All orders (paginated) |
| PATCH | `/orders/:id/status` | Admin | Update status |
