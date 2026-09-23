# CardVaulty

Self-hosted Pokémon card vault (scan, vault, prices, wishlist). UK-first.

**Phase 1 (MVP):** marketing landing page, email/password auth (optional Google), private vault CRUD, dashboard stub, account page, legal placeholders.

## Stack

- **Next.js** 16 (App Router, TypeScript, Tailwind CSS)
- **Auth.js** (NextAuth v5) — credentials + optional Google OAuth
- **Prisma** + **Postgres** 16
- **Redis** 7 (reserved for later)
- **nginx** reverse-proxy in front of the app

## Prerequisites

- Docker and Docker Compose v2
- Node.js 20+ (for local `npm` development)

## Quick start (Docker)

```bash
git clone https://github.com/idesignda3/cardvaulty.git
cd cardvaulty

cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD, AUTH_SECRET, and URLs
# For Compose, set DATABASE_URL host to `postgres` (not localhost):
#   DATABASE_URL=postgresql://cardvaulty:…@postgres:5432/cardvaulty
#   REDIS_URL=redis://redis:6379
#   APP_URL=http://localhost
#   NEXTAUTH_URL=http://localhost

docker compose up --build -d

# Apply migrations (run once against the Compose Postgres):
docker compose exec app npx prisma migrate deploy
# If the app image lacks the prisma CLI path, run from a one-off container:
# docker compose run --rm -e DATABASE_URL=postgresql://cardvaulty:…@postgres:5432/cardvaulty app npx prisma migrate deploy
```

Alternatively start infra only and migrate from the host:

```bash
docker compose up -d postgres redis
# .env DATABASE_URL should use localhost:5432
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Open [http://localhost](http://localhost) (nginx → app) or [http://localhost:3000](http://localhost:3000) for `npm run dev`.

## Database migrations

```bash
npx prisma generate          # generate client (also runs on postinstall)
npx prisma migrate deploy    # apply committed migrations (prod / CI)
npx prisma migrate dev       # create/apply migrations in development
```

Initial migration lives in `prisma/migrations/`.

## Auth

- Register / sign in at `/auth` with email + password (min 8 characters).
- Optional Google OAuth when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set; the button is hidden when unset.
- Sessions use JWT (`AUTH_SECRET` required).

### Google OAuth callback URLs

In Google Cloud Console → Credentials → OAuth 2.0 Client:

| Type | Value |
|---|---|
| Authorized JavaScript origins | `APP_URL` (e.g. `http://localhost:3000` or `https://your.domain`) |
| Authorized redirect URI | `{APP_URL}/api/auth/callback/google` |

Also set `NEXTAUTH_URL` / `AUTH_URL` to the same public origin.

## Environment

See `.env.example`:

| Variable | Purpose |
|---|---|
| `APP_URL` | Public base URL |
| `NEXTAUTH_URL` | Auth.js canonical URL (keep aligned with `APP_URL`) |
| `AUTH_SECRET` | Session signing secret |
| `DATABASE_URL` | Postgres connection string |
| `REDIS_URL` | Redis connection string |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth |
| `POSTGRES_*` | Postgres bootstrap for Compose |

Never commit real secrets. `.env` is gitignored.

## Security model (Phase 1)

- **No Postgres RLS** yet. Isolation is enforced in the application: every vault query filters by `userId` from the signed-in session.
- Money is stored as **integer pence** (`priceAvgPence`). The app does not invent live market prices.

## Routes

| Path | Access | Notes |
|---|---|---|
| `/` | Public | Marketing landing (scan / vault / prices CTAs) |
| `/auth` | Public | Register + sign in |
| `/vault` | Auth | List / add / edit / delete cards |
| `/dashboard` | Auth | Card count, total qty, sum of stored estimates |
| `/account` | Auth | Profile + sign out |
| `/privacy` `/terms` `/cookies` | Public | Legal stubs |

## Project layout

```
src/app/           App Router pages + server actions
src/auth.ts        Auth.js (NextAuth v5) config
src/proxy.ts       Optimistic auth gate for protected routes
prisma/            Schema + migrations
Dockerfile         Multi-stage production image (standalone)
docker-compose.yml app + postgres + redis + nginx
```

## Local development checklist

1. `cp .env.example .env` and set `AUTH_SECRET`, `DATABASE_URL` (localhost), passwords.
2. `docker compose up -d postgres redis`
3. `npm install && npx prisma migrate deploy && npx prisma generate`
4. `npm run dev` → http://localhost:3000
5. Register at `/auth`, add a card on `/vault`, check totals on `/dashboard`.

## Licence

Private repository — all rights reserved.
