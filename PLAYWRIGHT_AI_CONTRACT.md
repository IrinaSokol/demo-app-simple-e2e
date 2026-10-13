# Playwright AI Contract

Rules for any AI coding agent that writes or changes Playwright code in this repository.
Read this **before** touching any file. It describes THIS project, not Playwright in general.
The reasons behind each rule are in [`PLAYWRIGHT_AUDIT.md`](PLAYWRIGHT_AUDIT.md).

## 0. The two repositories

| Repo | Role | Your access |
|---|---|---|
| `../demo-app-simple` | the application under test (React + Express) | **read only** |
| `demo-app-simple-e2e` (this repo) | Playwright automation | read / write |

Never modify application code to make a test pass. If an element genuinely cannot be
located, stop and report it instead of inventing a selector or editing the app.

## 1. Discover before you write

Before creating any locator, read the product implementation:

1. The feature's React component in `../demo-app-simple/src/pages` or `src/components`.
2. The route definitions in `../demo-app-simple/src/App.tsx` — they give you the URLs.
3. The Express routes in `../demo-app-simple/server/routes/` — status codes and payloads.
4. The seed data in `../demo-app-simple/server/data/seed.ts` — what your assertions can rely on.

**Never guess a selector. Never take one from a screenshot or from memory.**
Every `getByTestId('x')` you write must match a `data-testid="x"` you have actually read
in the application source.

## 2. Locator priority

1. `getByTestId(...)` — the default in this project; the app ships stable `data-testid`s.
2. `getByRole` / `getByLabel` — only when no test id exists (form fields have `<label for>`,
   overlays have `role="dialog"`).
3. CSS, XPath and raw text selectors — **not allowed**.

Do not locate state-dependent controls by visible text: labels change while a request is
pending (`Login` → `Signing in…`, `Save` → `Saving…`). Use the test id.

## 3. Layer rules

```
spec  →  Page Object  →  Component  →  Locator
                      ↘  API client   (setup and verification)
```

- **Specs contain no selectors.** No `data-testid` string, `page.getBy…` or `page.locator`
  in `ui/specs/**`. If you need one, the behaviour belongs in a Page Object or Component.
- **A class that receives `Page` is a Page Object** → `ui/pages/**`, named `XxxPage`.
- **A class that receives `Locator` is a Component** → `ui/components/**`, named `XxxComponent`.
  A Component only queries inside its root locator. That is why the generic
  `data-testid="row"` is safe: it is always scoped by an already-scoped table locator.
- Page Objects expose `get root(): Locator` and pass it to their Components.
- **No assertions in Page Objects or Components.** They never import `expect`. They expose
  **Locators** (getters such as `root`, `title`, `saveButton`, or methods such as
  `projectRow(name)`) and **actions** (`open…`, `fill…`, `click…`, `create…`). The spec decides
  what is correct. Waiting for readiness is not asserting: use `locator.waitFor()`, as
  `waitForLoaded()` does.
- One class per file; the file name equals the class name.

## 4. Reuse before you create

Check these before writing anything new:

| Need | Use |
|---|---|
| app shell, sidebar navigation | `ui/pages/AppShellPage.ts`, `ui/components/navigation/SidebarComponent.ts` |
| projects / assets list | `ui/pages/dashboards/*DashboardPage.ts` |
| waiting for a list to load | `BaseDashboardComponent.waitForLoaded()` |
| finding a table row | `ui/components/common/DataTableComponent.ts` |
| create overlays | `ui/pages/create/BaseCreateRecordPage.ts` and its subclasses |
| being logged in | already done — the `ui` project uses `globalSetup.ts` storage state |
| credentials, URLs | `config/env.ts` (`config/users.ts` is unused) |
| HTTP calls | `api/clients/httpClient.ts` → a domain client in `api/clients/` |

Prefer **extending an existing class** over creating a near-duplicate. Create a new Page
Object only for a genuinely new screen or overlay. Register new Page Objects as fixtures in
`ui/fixtures/uiTest.ts`; register new API clients in `api/fixtures/apiTest.ts`.

## 5. Test data and setup

- Every authenticated spec starts from a clean seed:
  ```ts
  test.beforeEach(async ({ api, token }) => {
    expect(token, 'token for API setup').toBeTruthy();
    await api.admin.resetDemoData(token!);
  });
  ```
- **API for arrange, UI for act, UI and API for assert.** Do not click through a create form
  just to build a precondition — add or reuse a method on the matching `api/clients/*Client.ts`.
  API clients take the bearer `token` as an explicit argument on every call.
- Unique test data comes from `ui/fixtures/data.fixture.ts`; seed names come from
  `config/demoSeed.ts`. Do not hardcode either inside a spec.
- Never assert on rendered dates — the app formats them with `toLocaleDateString()`.

## 6. Writing a spec

- Import from the fixture, never from `@playwright/test`:
  `import { expect, test } from '../fixtures/uiTest';`
- One `test.describe` per file, titled `UI — <Area>` or `API — <area>` (em dash).
- Test titles describe **business behaviour** in lowercase, e.g.
  `'creates a project via overlay and returns to the list'` — not `'clicks save button'`.
- **Assertions are written in the spec**, with web-first `expect` on Locators exposed by Page
  Objects and Components:
  ```ts
  await expect(createProjectPage.overlay).toBeHidden();
  await expect(page).toHaveURL(projectsDashboard.url);
  await expect(projectsDashboard.dashboard.projectRow(project.name)).toBeVisible();
  ```
  Checks on API response data add a message:
  `expect(saved.name, 'name persisted by the API').toBe(input.name)`.
- URL patterns belong to the Page Object (`readonly url = /\/projects$/`), not to the spec.
- File name: `ui/specs/<area>.<feature>.spec.ts`.
- Method vocabulary: `open…`, `fill…`, `select…`, `click…`, `create…`, `waitFor…`. Locator
  getters are nouns. Every async method declares its return type (`: Promise<void>` / `: Promise<T>`).
- Separate arrange / act / assert with blank lines. No comments inside tests.

## 7. Register every new UI spec — do not skip

`playwright.config.ts` lists the `ui` project's spec files **explicitly** in `testMatch`.
A new authenticated spec that is not added to that array **silently never runs**.
Unauthenticated specs belong to the `ui-guest` project instead.

## 8. Stability

- Both list endpoints are delayed by 300–800 ms. Call `waitForLoaded()` before asserting on
  table contents, and again after any action that navigates back to a list.
- No `waitForTimeout`. Use web-first `expect` assertions.
- `fullyParallel: true` — tests must not depend on each other's data or order.
- Overlays have **no Escape handler and no click-outside-to-close**; only their own buttons
  close them.

## 9. Running

The target app comes from `.env` (`BASE_URL`, `API_URL`). For a local app (`npm run dev`
in `../demo-app-simple`) use `BASE_URL=http://localhost:5173` and `API_URL=http://localhost:3001`.

All specs share one in-memory server, and every UI spec resets it in `beforeEach`, so
parallel workers can wipe each other's data. Run UI specs with a single worker:
`npx playwright test <spec> --project=ui --workers=1` (or `npm run test:ui:serial`).
If a test fails only in parallel, do not "fix" it by removing the reset or adding waits —
report it.

## 10. Definition of done

Before reporting the task complete:

1. `npx playwright test <your-spec> --project=ui --workers=1` passes.
2. `npx tsc --noEmit -p tsconfig.json` is clean.
3. No `data-testid`, `getByTestId`, `getByRole` or `page.locator` in `ui/specs/**`, and no
   `expect` in `ui/pages/**` or `ui/components/**`.
4. The new spec is registered in `playwright.config.ts`.
5. Nothing in `../demo-app-simple` was modified.
6. Your report lists which application source files each locator was taken from.
