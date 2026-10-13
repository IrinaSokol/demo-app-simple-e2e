# Playwright framework audit

Audit of `demo-app-simple-e2e` as it was built in video #1 (commit `f544ea3`).

**Why this exists.** Before an AI agent writes tests in this repository, we must write down how
the framework actually works: which patterns to keep, and which ones to stop. This audit is the
input for [`PLAYWRIGHT_AI_CONTRACT.md`](PLAYWRIGHT_AI_CONTRACT.md). Every contract rule comes from a
finding here.

**Method.** Read every file under `api/`, `ui/`, `config/`, `globalSetup.ts` and
`playwright.config.ts`. Compare locators with the application source in `../demo-app-simple`.
Run the suite repeatedly against a local app (`npm run dev`).

---

## 1. Inventory

| Layer | Files | Notes |
|---|---|---|
| Specs | 5 UI (`ui/specs`), 2 API (`api/specs`) | 9 tests |
| Page Objects | 7 classes in `ui/pages/**` | constructor takes `Page` |
| Components | 5 classes in `ui/components/**` | constructor takes `Locator` |
| Fixtures | `api/fixtures/apiTest.ts` → `ui/fixtures/uiTest.ts` | one `test.extend` chain |
| API clients | `httpClient` + `auth`, `admin`, `projects`, `assets` | token passed per call |
| Test data | `ui/fixtures/data.fixture.ts`, `config/demoSeed.ts` | no faker, `Date.now()` names |
| Auth | `globalSetup.ts` writes `.auth/admin.json` | `localStorage.auth_token` |

Playwright projects: `api`, `ui` (authenticated through storage state), `ui-guest` (login spec only).

---

## 2. What works well — keep it

These patterns are good. The contract turns them into rules.

1. **Page vs Component is decided by the constructor.** A class that takes `Page` is a Page Object.
   A class that takes `Locator` is a Component and only queries inside that root. Pages expose
   `get root()` and pass it to their Components
   (`ProjectsDashboardPage` → `ProjectsDashboardComponent` → `DataTableComponent`).
2. **No selectors in specs.** Every locator is `getByTestId('…')` declared in `ui/pages/**` or
   `ui/components/**`. No CSS, XPath or text selectors anywhere.
3. **Locators match the product.** All 30+ test ids used by the framework exist as
   `data-testid` in `../demo-app-simple/src`. None are invented.
4. **Layered fixtures.** UI specs receive `api`, `token` and all Page Objects from one fixture chain.
5. **Thin API clients.** One client per domain, typed DTOs, explicit token argument.
6. **Consistent naming.** `XxxPage`, `XxxComponent`, `Base…` for abstract classes,
   `<area>.<feature>.spec.ts`, verb-prefixed methods (`open…`, `fill…`, `click…`, `create…`).
7. **Business-readable specs.** Specs read as user steps and contain no comments.

---

## 3. Findings

### F1. Assertions live inside Page Objects and Components — high

`expect` is imported in **8 of 12** classes. They hold **14 `expect…()` methods**. Two more
Components inherit or delegate them.

| Class | Assertion methods |
|---|---|
| `ui/pages/AppShellPage.ts:12` | `expectLoaded` |
| `ui/pages/LoginPage.ts:17` | `expectVisible` |
| `ui/pages/create/BaseCreateRecordPage.ts:17-41` | `expectVisible`, `expectHidden`, `expectOverlayOpen`, `expectUrlContains` |
| `ui/pages/dashboards/ProjectsDashboardPage.ts:25,35` | `expectOpen`, `expectUrlIsProjectsList` |
| `ui/pages/dashboards/AssetsDashboardPage.ts:25,33` | `expectOpen`, `expectUrlIsAssetsList` |
| `ui/components/common/DataTableComponent.ts:12` | `expectRowVisible` |
| `ui/components/dashboards/BaseDashboardComponent.ts:27` | `expectTitleContains` |
| `ui/components/dashboards/ProjectsDashboardComponent.ts:13` | `expectHasProject` |
| `ui/components/dashboards/AssetsDashboardComponent.ts:13` | `expectHasAsset` |

`BaseDashboardComponent.waitForLoaded()` also uses `expect` to *wait*, not to verify.

**Why this is a problem:**
- A Page Object should describe **how to reach and use** the UI. A test should decide **what is
  correct**. Today both live in the Page Object, so the spec hides its own checks: reading
  `expectHasProject(name)` does not tell you whether it checks visibility, text or count.
- Every new check needs a new Page Object method. The API grows with one-off methods.
  `expectOverlayOpen` is already a copy of `expectVisible`.
- Opposite checks are impossible without more methods. For example, you cannot check that a row
  is *not* visible with `expectRowVisible`.
- **An AI agent copies the patterns it sees.** If Page Objects contain assertions, every
  generated Page Object will too, and the problem multiplies with every new feature.

**Decision:** Page Objects and Components expose **Locators** and **actions** only, and never import
`expect`. Assertions are written in specs, with web-first `expect`. Waiting is not asserting:
readiness helpers use `locator.waitFor()`.

### F2. New UI specs must be registered by hand — high

The `ui` project in `playwright.config.ts` lists its spec files **explicitly** in `testMatch`.
A new spec that is not added there **never runs, and nothing reports it**. People forget this
easily, and an agent will not know about it unless told.

**Decision:** the contract makes registration a mandatory step and part of the definition of done.

### F3. Per-test global reset races under parallel runs — high

Every UI spec calls `api.admin.resetDemoData` in `beforeEach`. All tests share one in-memory
server, and the config sets `fullyParallel: true`. A reset in one worker wipes records another
worker has just created.

Evidence: with `--repeat-each=5 --retries=0`, **5 of 45** tests failed: the create specs could not
find the row they had just created. Normally `retries: 1` hides this.

**Decision:** until the setup is fixed, run UI specs with `--workers=1` and never "fix" such a
failure with waits. The real fix is to reset once per run instead of per test (planned later in
this video series).

### F4. No API methods to create data — medium

`ProjectsClient` and `AssetsClient` can only list records. Any test that needs an existing record
must create it through the UI form. That is slow, and it tests the form again in every scenario.

**Decision:** "API for arrange, UI for act". Add create methods to the domain client when they
are needed.

### F5. Generated names can collide — low

`createProjectInput()` / `createAssetInput()` use `Date.now()` as the only unique part. Two
parallel workers can get the same millisecond and produce the same name. Then a row lookup matches
two rows.

### F6. Dead and duplicate code — low

- `config/users.ts` is not imported anywhere. Credentials come from `config/env.ts`.
- `ui/fixtures/auth.fixture.ts` (`loginThroughUi`) is not used by any spec.
- `search()` on both dashboard Components is not used by any spec.
- `BaseCreateRecordPage.expectOverlayOpen()` duplicates `expectVisible()`.
- `ui/fixtures/*.fixture.ts` are plain helpers, not Playwright fixtures, despite the name.

An agent may treat dead code as a pattern to follow. The contract names the real sources:
`config/env.ts` for credentials, `uiTest.ts` for fixtures.

### F7. Small inconsistencies — low

- `ui/specs/auth.login-ui.spec.ts` creates `AppShellPage` and `ProjectsDashboardPage` with `new`.
  Other specs receive Page Objects from fixtures.
- `token` is typed `string`, but every call site uses `token!`.
- `config/env.ts` `required()` never throws. A typo in a variable name silently falls back to
  the default.

### F8. Conventions are not written down for agents — high

Only three architecture lines exist, in `README.md`. There is no `CLAUDE.md` and no agent
instruction file. An agent sees the code, but not the reasons. It cannot tell an intended rule
(no selectors in specs) from an accident (dead code).

**Decision:** write `PLAYWRIGHT_AI_CONTRACT.md` and point `CLAUDE.md` at it in both repositories.

### F9. Product-side locator gaps — info

The application is well instrumented. Every form field has `<label for>` and a `data-testid`, and
overlays have `role="dialog"`. Known gaps an agent will hit:
- Table rows use one generic `data-testid="row"` with no record id. They are only safe when scoped
  to a table.
- Error paragraphs have `role="alert"` but no test id.
- Button labels change while a request is pending (`Save` → `Saving…`), so they are not stable
  locators.

---

## 4. From audit to contract

| Finding | Contract rule |
|---|---|
| §2 patterns 1–7 | §3 Layer rules, §4 Reuse, §6 Writing a spec |
| F1 assertions in Page Objects | §3 *No assertions in Page Objects or Components* |
| F2 manual spec registration | §7 Register every new UI spec |
| F3 reset race | §9 Running (interim `--workers=1`) |
| F4 no create API | §5 API for arrange, UI for act |
| F6 dead code | §4 Reuse table names the real sources |
| F8 nothing written down | the contract itself, plus `CLAUDE.md` |
| F9 product locator gaps | §1 Discover before you write, §2 Locator priority |
