# demo-app-simple — E2E (Playwright)

TypeScript Playwright suite for the **demo-app-simple** app (React + Express demo): **API** specs, **UI** specs, page/component objects, and API-based test setup. Demo data is reset once per run in `globalSetup.ts`.

## Video series

This repository is used in a YouTube series. `main` always has the latest version. The code shown in each video is kept in a git tag with the same name in both repositories ([demo-app-simple](https://github.com/IrinaSokol/demo-app-simple) and this one).

| Video | Tag | Topic |
|---|---|---|
| 1 | [`video-1`](https://github.com/IrinaSokol/demo-app-simple-e2e/tree/video-1) | Playwright test architecture: Page Objects, Components, fixtures, API helpers |
| 2 | [`video-2`](https://github.com/IrinaSokol/demo-app-simple-e2e/tree/video-2) | AI-first Playwright: repository audit, AI contract, Claude Code writing tests from the product source |

To get the code from a specific video: `git checkout video-1` (or `video-2`) in both repositories.

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
4. Pages/components expose locators and actions only; assertions (`expect`) live in specs.
5. Tests run fully in parallel against one shared server: data is reset once per run, never per test, and tests that change data create their own uniquely named records.

## Working with an AI coding agent

[`PLAYWRIGHT_AUDIT.md`](PLAYWRIGHT_AUDIT.md) records how the framework works and what to change; it is the input for the contract.

[`PLAYWRIGHT_AI_CONTRACT.md`](PLAYWRIGHT_AI_CONTRACT.md) describes this architecture as rules an AI agent (e.g. Claude Code) must follow when it creates or changes tests: discover locators from the application source, keep selectors out of specs, reuse Page Objects and Components, use the API for setup, and register new specs in `playwright.config.ts`.

Open this repo and `demo-app-simple` in the same workspace so the agent can read the product code. `CLAUDE.md` points Claude Code at the contract automatically.

**Self-review before a PR.** The Claude Code skill [`.claude/skills/sdet-self-review`](.claude/skills/sdet-self-review/SKILL.md) reviews the current branch against the contract and reports findings without changing code. In Claude Code, run `/sdet-self-review` (compares with `main`) or `/sdet-self-review <base-branch>`.

## Alignment with the app

| Topic | Value |
|--------|--------|
| Routes | `/login`, `/projects`, `/projects/new`, `/projects/:projectId`, `/assets`, `/assets/new` |
| API | `POST /api/auth/login`, projects/assets CRUD, `POST /api/admin/reset` |
| Auth | `Authorization: Bearer demo-token` |
| localStorage | key `auth_token` |

If Playwright reports **`test.describe` not expected**, you usually have two copies of `@playwright/test`. Delete `node_modules`, run `npm install` again, and use `npm test` from this directory only.
