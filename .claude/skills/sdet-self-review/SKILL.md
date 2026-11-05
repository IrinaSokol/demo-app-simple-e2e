---
name: sdet-self-review
description: Review the current branch of this Playwright repo against PLAYWRIGHT_AI_CONTRACT.md before opening a PR. Use when asked to self-review, review my branch, or check a branch before a pull request.
---

# SDET self-review

Review the current branch locally, the way a senior SDET would review a PR. Check it against
this project's rules in `PLAYWRIGHT_AI_CONTRACT.md`.

**Report only. Do not edit, commit or push anything.**

## 1. Find what changed

The base branch is the argument if given (`$ARGUMENTS`), otherwise `main`.

```bash
git diff <base>...HEAD --stat
git diff <base>...HEAD
```

Review only the files in this diff.

## 2. Read the rules

Read `PLAYWRIGHT_AI_CONTRACT.md`. Every finding must point to a contract section.

## 3. Check the diff

| # | Check | Contract |
|---|---|---|
| 1 | No `getByTestId`, `getByRole`, `page.locator` or `data-testid` in `ui/specs/**` | §3 |
| 2 | No `expect` in `ui/pages/**` or `ui/components/**` | §3 |
| 3 | Every new `getByTestId('x')` exists as `data-testid="x"` in `../demo-app-simple/src` | §1 |
| 4 | Existing Page Objects and Components were reused, not duplicated | §4 |
| 5 | Setup uses API clients, not clicks through forms | §5 |
| 6 | No `resetDemoData` in UI specs, no changes to seed records | §5 |
| 7 | Test titles describe business behaviour | §6 |
| 8 | Every new UI spec is listed in `playwright.config.ts` | §7 |
| 9 | No `waitForTimeout` | §8 |

For check 3, search the application source for each new test id. A test id that is missing
from the app is a **blocker**: the test was built on a guessed selector.

## 4. Run the quick checks

```bash
npx tsc --noEmit -p tsconfig.json
grep -rnE "getByTestId|getByRole|page\.locator|data-testid" ui/specs
grep -rn "expect" ui/pages ui/components
```

If the app is running, also run the changed specs: `npx playwright test <spec files>`.
If it is not running, say so in the report. Do not skip this silently.

## 5. Report

```markdown
## Self-review: <branch> vs <base>

**Verdict:** Ready for PR | Fix before PR

### Findings
| Severity | File:line | Problem | Contract | Suggested fix |
|---|---|---|---|---|
| blocker / should fix / nit | … | … | §… | … |

### Passed
- <checks that passed>

### Not checked
- <anything you could not verify, and why>
```

Severity:
- **blocker**: breaks a contract rule or the test cannot work, for example a guessed selector,
  an unregistered spec or a failing type check.
- **should fix**: works, but makes the suite harder to maintain, for example duplicated Page
  Object logic.
- **nit**: style.

Keep it short. If there are no findings, say "Ready for PR" and list what you checked.
