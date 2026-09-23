# CardVaulty

Self-hosted Pokémon card vault (scan, vault, prices, wishlist). UK-first.

**Phase 1:** marketing landing, email/password auth (optional Google), private vault CRUD, dashboard stub, account, legal stubs.

**Phase 2:** public sets catalogue + price pages via [Pokémon TCG API](https://docs.pokemontcg.io/), Frankfurter FX (GBP default), Redis/Postgres response cache, optional TCGdex image fallback.

UI is intentionally plain (functional Tailwind) until design is decided.

## Stack

- **Next.js** 16 (App Router, TypeScript, Tailwind CSS)
- **Auth.js** (NextAuth v5) — credentials + optional Google OAuth
- **Prisma** + **Postgres** 16
- **Redis** 7 (optional cache; Postgres `ApiCache` is the durable fallback)
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
# Optional: POKEMONTCG_API_KEY from https://dev.pokemontcg.io/

docker compose up --build -d
docker compose exec app npx prisma migrate deploy
```

Infra-only + local Next:

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

Migrations live in `prisma/migrations/`.

## Auth

- Register / sign in at `/auth` with email + password (min 8 characters).
- Optional Google OAuth when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- Sessions use JWT (`AUTH_SECRET` required).

### Google OAuth callback URLs

| Type | Value |
|---|---|
| Authorized JavaScript origins | `APP_URL` |
| Authorized redirect URI | `{APP_URL}/api/auth/callback/google` |

## Environment

See `.env.example`:

| Variable | Purpose |
|---|---|
| `APP_URL` | Public base URL |
| `NEXTAUTH_URL` | Auth.js canonical URL (align with `APP_URL`) |
| `AUTH_SECRET` | Session signing secret |
| `DATABASE_URL` | Postgres connection string |
| `REDIS_URL` | Redis connection string (optional cache) |
| `POKEMONTCG_API_KEY` | Optional Pokémon TCG API key (higher rate limits) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth |
| `POSTGRES_*` | Postgres bootstrap for Compose |

Never commit real secrets. `.env` is gitignored.

## Pricing & catalogue (Phase 2)

- **Source:** Pokémon TCG API (`api.pokemontcg.io`). Prices are only shown when `tcgplayer` / `cardmarket` fields exist on the API response. The app never invents market figures.
- **FX:** [Frankfurter](https://www.frankfurter.app/) (`api.frankfurter.dev`). Default display currency **GBP**; switch to EUR/USD via `?currency=`. Rates cached ~24h (Redis + `FxRate` table).
- **Cache:** Redis when available; always mirrored in Postgres `ApiCache` / `CardCache`.
- **Images:** Pokémon TCG images first; if missing, optional [TCGdex](https://tcgdex.dev/) fallback.
- **Money in vault:** still stored as integer pence (`priceAvgPence`).

## Security model

- **No Postgres RLS** yet. Isolation is enforced in the application: every vault query filters by `userId` from the signed-in session.
- Sets/prices routes are public (SEO-friendly). Signed-in users see owned counts on set checklists; guests get a light sign-in hint only.

## Routes

| Path | Access | Notes |
|---|---|---|
| `/` | Public | Marketing landing |
| `/auth` | Public | Register + sign in |
| `/sets` | Public | Set list (API) |
| `/sets/[setId]` | Public | Set checklist; owned counts if signed in |
| `/prices` | Public | Recent sets + sample API estimates |
| `/prices/[cardId]` | Public | Card price detail (API fields only) |
| `/vault` | Auth | List / add / edit / delete cards |
| `/dashboard` | Auth | Card count, total qty, sum of stored estimates |
| `/account` | Auth | Profile + sign out |
| `/privacy` `/terms` `/cookies` | Public | Legal stubs |

## Project layout

```
src/app/           App Router pages + server actions
src/lib/           Prisma, money, pokemontcg, fx, cache, tcgdex
src/auth.ts        Auth.js (NextAuth v5) config
src/proxy.ts       Optimistic auth gate for protected routes
prisma/            Schema + migrations
Dockerfile         Multi-stage production image (standalone)
docker-compose.yml app + postgres + redis + nginx
```

## Local development checklist

1. `cp .env.example .env` and set `AUTH_SECRET`, `DATABASE_URL` (localhost), passwords.
2. Optionally set `POKEMONTCG_API_KEY`.
3. `docker compose up -d postgres redis`
4. `npm install && npx prisma migrate deploy && npx prisma generate`
5. `npm run dev` → http://localhost:3000
6. Browse `/sets` and `/prices` (public). Register at `/auth`, add a vault card, check `/dashboard`.

## Licence

Private repository — all rights reserved.
