# demo-app-simple — E2E (Playwright)

TypeScript Playwright suite for the **demo-app-simple** app (React + Express demo): **API** specs, **UI** specs, page/component objects, and API setup in `beforeEach` (e.g. seed reset).

This folder is a **separate npm project** from the app: use a **separate git repository** (e.g. `git init` here and push to its own GitHub repo); do not deploy this project to Heroku. Point tests at **local dev** or at your **deployed** app URL.

## Prerequisites

1. **App running** — locally (`npm run dev` or `npm run build && npm start` in the app repo) or deployed (e.g. Heroku).
2. **Node** — install deps and browsers:

```bash
cd demo-app-simple-e2e
npm install
npx playwright install chromium
```

## Environment

Copy `.env.example` → `.env` in **this** project root (`demo-app-simple-e2e/.env`).

| Variable | Local (Vite + Express) | Deployed (single origin) |
|----------|------------------------|---------------------------|
| `BASE_URL` | `http://localhost:5173` | `https://your-app.herokuapp.com` |
| `API_URL` | `http://localhost:3001` | **Same as `BASE_URL`** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Demo admin | Same as app |

If you run **only** `npm run build && npm start` locally (one server), set **both** `BASE_URL` and `API_URL` to `http://localhost:3001`.

## Run tests

```bash
npm test                 # all projects (api, ui, ui-guest)
npm run test:api         # API only
npm run test:ui          # authenticated UI + guest login spec
npm run test:headed      # headed browser
npm run test:report      # open HTML report

# single Playwright worker (sequential; same as --workers=1)
npm run test:serial
npm run test:api:serial
npm run test:ui:serial
npm run test:headed:serial
```

On **Windows PowerShell**, `npm run … -- --workers=1` often does **not** forward extra args (Playwright never sees them). Prefer the `:serial` scripts above, or run Playwright directly, e.g. `npx playwright test --project=ui --project=ui-guest --workers=1`, or use `npm.cmd run test:ui -- --workers=1`.

## Layout

| Area | Contents |
|------|----------|
| `api/` | HTTP clients, `apiTest` fixture, API specs |
| `ui/` | Page/component objects, UI specs, `uiTest` fixture |
| `config/` | `env`, users, seed constants aligned with the app |
| `globalSetup.ts` | Writes `.auth/admin.json` (`localStorage` `auth_token`) |

## Architecture (short)

1. Selectors live under `ui/pages` and `ui/components` only.
2. Specs call pages/components; avoid raw `data-testid` strings in spec files.
3. UI tests use `api` + `token` from fixtures for setup/teardown.

## Alignment with the app

| Topic | Value |
|--------|--------|
| Routes | `/login`, `/projects`, `/projects/new`, `/assets`, `/assets/new` |
| API | `POST /api/auth/login`, projects/assets CRUD, `POST /api/admin/reset` |
| Auth | `Authorization: Bearer demo-token` |
| localStorage | key `auth_token` |

If Playwright reports **`test.describe` not expected**, you usually have two copies of `@playwright/test`. Delete `node_modules`, run `npm install` again, and use `npm test` from this directory only.
