# Test Strategy — Reporting Tool Regression Suite

## Goal

Cut manual retest time on recurring releases of the internal reporting
application by automating the highest-value, most-repeated regression
checks, while keeping manual QA and automation working from one shared
backlog of test cases.

## Scope

Core end-to-end user journeys an analyst or QA engineer repeats every
release:

- **Authentication** — valid/invalid login, empty submission
- **Dashboards** — loading, search, opening, filtering
- **Report building** — creating a report, running a query, saving it
- **Filtering** — narrowing and clearing filters on report results
- **Export** — CSV/PDF download correctness
- **Collections** — the shared repository structure reports live in

Out of scope for this suite (left to manual/exploratory QA per the shared
test case repository): visual/pixel-level review, complex permission
matrices, data-warehouse-level data validation, and load/performance
testing.

## Approach

- **Page Object Model** (`pages/`) isolates selectors from test logic so UI
  changes require updating one file, not every spec.
- **Tagged tests** (`@smoke`, `@regression`) let the pipeline run a 2–3
  minute health check before committing to a full ~20–40 minute regression
  pass, so a broken build/deploy fails fast.
- **Shared authenticated session** via `tests/auth.setup.js` and Playwright's
  `storageState` avoids re-logging in for every single spec.
- **Cross-browser** — the regression stage runs Chromium, Firefox, and
  WebKit; the smoke gate runs Chromium only, to keep the fail-fast check
  cheap.
- **Traceability** — every automated spec references a `TC-###` ID from
  `test-case-repository/regression-test-cases.csv`, so coverage can be
  audited from either direction (case → spec, or spec → case).

## CI Gating (Azure DevOps)

1. `Smoke` stage runs first on every push/PR. A failure here stops the
   pipeline immediately — it usually indicates a broken deploy rather than
   a real regression, so there's no value in continuing.
2. `Regression` stage runs only if smoke passes, executing the full tagged
   suite across all three browser engines in parallel workers.
3. JUnit results are published via `PublishTestResults@2` so failures show
   up natively in the Azure DevOps Tests tab; the Playwright HTML report
   (with traces, screenshots, and video for failures) is published as a
   pipeline artifact for debugging.
4. Flaky-test tolerance: 2 retries on CI only, so a genuinely broken test
   still fails the build, but a one-off network blip doesn't block a
   release.

## Maintenance

- New regression coverage should be added to the CSV first (see
  `test-case-repository/README.md`), then implemented as a spec.
- Selectors favor `data-testid`/ARIA roles over CSS classes where the
  target application exposes them, to reduce breakage from styling
  changes.
- Review the suite each release for cases that have become obsolete
  (feature removed/changed) versus ones that need updated locators.
