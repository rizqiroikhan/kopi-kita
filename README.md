# Kopi Kita

Kopi Kita is a warm, modern coffee-shop website with a database-backed menu, booking flow, and protected admin CMS. The public pages help guests discover products and book a table; the CMS lets staff manage products and confirm bookings.

## Features

- Responsive landing page, menu, and booking pages
- PostgreSQL-backed product catalog and bookings
- Category filters, unavailable-product states, loading and recovery states
- Server-side booking validation
- Protected admin product and booking management
- Database-backed HttpOnly admin sessions that survive app restarts
- Same-origin Next.js API routes backed by an embedded Express app
- Docker Compose for local PostgreSQL

## Tech stack

Next.js 16, React 19, TypeScript, Tailwind CSS, Express, `pg`, PostgreSQL 16, Docker Compose, and Vercel-compatible deployment configuration.

## Local setup

1. Install Node.js 20+ and Docker Desktop.
2. Copy `.env.example` to `.env` and replace `SESSION_SECRET` with a long random value.
3. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

4. Apply the schema and seed data:

   ```bash
   npm run db:reset
   ```

5. Start the single Next.js application server:

   ```bash
   npm install
   npm run dev
   ```

Open `http://localhost:3000`. The admin login is at `/admin/login`; credentials come from the seeded `admins` row.

## Environment variables

`.env` is local-only and ignored by Git. Use `.env.example` as the template. Required variables are `DATABASE_URL` and `SESSION_SECRET`; use a Neon connection string for production.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment

The app is structured for Vercel deployment. Configure `DATABASE_URL` and `SESSION_SECRET` as Vercel environment variables, then deploy the `master` branch. No production URL is claimed in this repository until a deployment is actually provisioned and verified.

## Screenshots

Evidence screenshots should be captured from the running app and stored outside source control unless they are intentionally added to a portfolio submission.
