# CardVaulty

Self-hosted Pokémon card vault (scan, vault, prices, wishlist). UK-first.

This repository is a **fresh Next.js + Docker foundation** for running CardVaulty on your own VPS (e.g. Hostinger). It is not the full product yet.

## Stack

- **Next.js** (App Router, TypeScript, Tailwind CSS)
- **Postgres** 16
- **Redis** 7
- **nginx** reverse-proxy placeholder in front of the app

## Prerequisites

- Docker and Docker Compose v2
- Node.js 20+ (optional, for local `npm` development without Docker)

## Quick start (Docker)

```bash
git clone https://github.com/idesignda3/cardvaulty.git
cd cardvaulty

cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD, AUTH_SECRET, and URLs as needed

docker compose up --build -d
```

Open [http://localhost](http://localhost) (nginx on port 80 proxies to the Next.js app).

Useful commands:

```bash
docker compose logs -f app
docker compose ps
docker compose down
```

## Local development (without Docker app)

```bash
cp .env.example .env
# Point DATABASE_URL / REDIS_URL at local or compose-only DB services

npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

You can run only infra with:

```bash
docker compose up -d postgres redis
```

## Environment

See `.env.example` for placeholders:

| Variable | Purpose |
|---|---|
| `APP_URL` | Public base URL |
| `AUTH_SECRET` | Session / auth signing secret |
| `DATABASE_URL` | Postgres connection string |
| `REDIS_URL` | Redis connection string |
| `POSTGRES_*` | Postgres bootstrap for Compose |

Never commit real secrets. `.env` is gitignored; `.env.example` is safe to commit.

## Project layout

```
src/app/           Next.js App Router
Dockerfile         Multi-stage production image (standalone)
docker-compose.yml app + postgres + redis + nginx
docker/nginx/      Reverse-proxy config placeholder
.env.example       Env placeholders
```

## Licence

Private repository — all rights reserved.
