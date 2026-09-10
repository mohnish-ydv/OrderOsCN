# OrderOS

OrderOS turns messy dealer messages into verified, actionable orders for Indian distributors.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/orderos` — React/Vite operator workspace and routes
- `artifacts/api-server/src/routes/orderos.ts` — demo API and deterministic synthetic dataset
- `lib/api-spec/openapi.yaml` — source of truth for generated API hooks and schemas
- `artifacts/orderos/src/index.css` — OrderOS visual tokens and theme

## Architecture decisions

- The first experience is a clearly labelled synthetic demo so operators can explore the exception-first workflow without connected customer systems.
- Confidence values are normalized from 0 to 1 across the API; financial totals and validation stay deterministic rather than delegated to an LLM.
- Dealer memory is scoped by dealer in the API and UI; it is never presented as a global alias dictionary.

## Product

The app provides a command center, searchable order inbox, order detail and approval flow, dealer profiles, product catalogue, dealer-specific AI memory, operational analytics, and an unavailable-integrations state.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- When the API contract changes, run `pnpm --filter @workspace/api-spec run codegen` before checking the frontend.
- Use the managed `artifacts/api-server: API Server` and `artifacts/orderos: web` workflows; the app relies on the proxy paths `/api` and `/`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
