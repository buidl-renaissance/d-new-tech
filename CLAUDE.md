# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **yarn** (see `yarn.lock`).

```bash
yarn dev          # start Next.js dev server with Turbopack on :3000
yarn build        # production build
yarn start        # serve production build
yarn lint         # next lint (ESLint + next/core-web-vitals + next/typescript)

yarn db:generate  # generate a Drizzle migration from schema changes
yarn db:migrate   # apply migrations
yarn db:push      # push schema directly (skip migration files; dev only)
yarn db:studio    # open Drizzle Studio
```

There is no test runner configured.

## Architecture

This is a **Next.js 15 Pages Router** app (not App Router) that serves both a marketing/community page for D-NewTech (Detroit New Technology) and a **Farcaster Mini App**. The single page at `src/pages/index.tsx` is the entire UI; everything else is API routes, DB layer, and Farcaster SDK plumbing.

### Key conventions

- TypeScript path alias `@/*` → `./src/*`.
- All styling via **styled-components** (compiler enabled in `next.config.ts`); no Tailwind, no CSS modules beyond a couple of legacy `*.module.css` files in `src/styles/`. The Detroit color palette and animation keyframes live at the top of `src/pages/index.tsx`.
- `@farcaster/miniapp-sdk` is in `transpilePackages` — it's ESM-only and must be transpiled by Next.
- React `strictMode: true`.

### Database (Drizzle + libSQL/Turso)

- Schema: `src/db/schema.ts` — tables: `users`, `farcaster_accounts`, `members`, `messages`. All IDs are text UUIDs (uuid v4); timestamps are SQLite integer epoch seconds via `strftime('%s','now')`.
- Connection: `src/db/drizzle.ts` exports `getDb()` and a `db` singleton. The same code runs locally and in production:
  - If `TURSO_DATABASE_AUTH_TOKEN` is set → remote Turso (`turso` dialect in `drizzle.config.ts`).
  - Otherwise → local file SQLite. `TURSO_DATABASE_URL` defaults to `file:./dev.sqlite3`.
- `drizzle.config.ts` loads `.env.local` then `.env` via `dotenv` and **throws** if `TURSO_DATABASE_URL` is unset, so any drizzle-kit command needs at least that var (use `file:./dev.sqlite3` for local). Migrations live in `/drizzle`.
- Domain helpers (`getOrCreateUserByFid`, `upsertFarcasterAccount`, etc.) are in `src/db/user.ts`. Prefer extending these over inlining new Drizzle queries in API routes.

### Authentication & sessions

There are **three** ways a request can identify a user; API routes typically check all three. The pattern is duplicated in `src/pages/api/members.ts`, `messages.ts`, and `user/me.ts` as a local `getUserFromRequest` helper — keep that pattern when adding new authenticated routes:

1. `Authorization: Bearer <token>` — Quick Auth JWT verified against Neynar (`/v2/farcaster/quick-auth/verify`). Only `user/me.ts` does this currently.
2. `?userId=<id>` query param — used as a fallback when the SDK passes the user via URL (e.g. frame `post_redirect`).
3. `user_session` HTTP-only cookie (24h, SameSite=Lax) — set by `/api/auth/miniapp` and `/api/auth/verify` after authenticating.

`/api/auth/miniapp` **trusts the client-supplied SDK context** (fid + profile fields) and creates/updates the user. It's the path used by the in-app `UserContext` flow. `/api/auth/verify` is the stricter path that verifies a Quick Auth JWT or SIWF message via Neynar before issuing a session — use it when you need verified auth.

### Farcaster Mini App integration

- The manifest is served at `/.well-known/farcaster.json` via a rewrite in `next.config.ts` to `/api/well-known/farcaster.json`. The `/.well-known/*` route also has permissive CORS headers configured in `next.config.ts`. `accountAssociation` comes from env vars (`FARCASTER_ACCOUNT_ASSOCIATION_HEADER` / `_PAYLOAD` / `_SIGNATURE`) generated via the Farcaster mobile app's domain manifest tool — they must be set in production.
- `src/contexts/UserContext.tsx` (the `UserProvider`) is **dynamically imported with `ssr: false`** in `_app.tsx` because the SDK is client-only. This provider is intentionally over-defensive: it tries the imported SDK, several `window.*` globals (`__FARCASTER_SDK__`, `farcaster`, `__renaissanceAuthContext`, `getRenaissanceAuth()`), `postMessage` events from the iOS host, custom DOM events (`farcaster:user`, `farcaster:context:ready`), and a 12-second polling loop, before finally falling back to `/api/user/me`. When changing auth flow, preserve these fallbacks — different host environments (Warpcast web, iOS, frame redirect) deliver context differently.
- `src/lib/farcaster/FarcasterProvider.tsx` exists as a lighter-weight provider that just calls `sdk.actions.ready()` and exposes context, but `_app.tsx` currently only mounts `UserProvider` — that's where `sdk.actions.ready()` is effectively gated through the import there.

### API routes

All under `src/pages/api/`:
- `auth/miniapp.ts`, `auth/verify.ts` — described above.
- `user/me.ts` — current user lookup with the three-way auth check.
- `members.ts` — GET returns count + recent 8 (with `isMember` for current user); POST joins the current user as a member.
- `messages.ts` — GET returns last 50 (oldest-first); POST creates a message (max 500 chars, must be authenticated).
- `meetup/events.ts` — proxies `https://meetup.builddetroit.xyz/api/meetup/events` and filters for "DNewTech"/"D-NewTech"/"D New Tech" in the title.
- `well-known/farcaster.json.ts` — manifest (see above).
- `hello.ts` — boilerplate, unused.

### Required env vars

```
TURSO_DATABASE_URL              # required by drizzle-kit; "file:./dev.sqlite3" for local
TURSO_DATABASE_AUTH_TOKEN       # required for remote Turso only
NEXT_PUBLIC_APP_URL             # public URL; used in the Farcaster manifest
NEYNAR_API_KEY                  # required for /api/auth/verify and Bearer-token auth in /api/user/me
FARCASTER_ACCOUNT_ASSOCIATION_HEADER
FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD
FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE
FARCASTER_SIGNER_UUID
```

`.env.local` is gitignored (`.env*`); use it for local secrets.
