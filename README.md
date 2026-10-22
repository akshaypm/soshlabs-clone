# soshlabs-clone

Static-first rebuild of the public marketing site at <https://soshlabs.ai/>.

This repository currently holds the app scaffold only. Marketing pages are not built yet.

```bash
npm install
npm run dev
```

See `AGENTS.md` for the stack, commands, and conventions.

## API

The product API is a separate package in `api/`. It does not call `api.soshlabs.ai`.

```bash
docker compose up -d
cd api
cp .env.example .env
npm ci
npx prisma migrate deploy
npm run dev
```

- `GET http://localhost:4000/` → `{ "status": "ok", "service": "Sosh AI API", "health": "/api/v1/health" }`
- `GET http://localhost:4000/api/v1/health` pings Postgres
- `POST http://localhost:4000/api/v1/ai/ping` requires `Authorization: Bearer <Clerk session JWT>` and `x-org-id` (a Brand Space id the user belongs to)

`npm test` from `api/` needs `DATABASE_URL` and a migrated database. It deletes rows in the core tables of that database. With no `ANTHROPIC_API_KEY`, the AI ping uses a deterministic fake provider. Clerk and Anthropic keys are only required to run those integrations for real; the names are in `api/.env.example`.
