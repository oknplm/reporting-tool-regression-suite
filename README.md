# Reporting Tool — Automated Regression Suite

Playwright + JavaScript regression suite for an internal reporting
application, built to cut manual retest time on recurring releases and
wired into an Azure DevOps pipeline. A shared CSV test-case repository keeps
manual and automated QA working from the same backlog.

> **Note on the target app:** this suite is written against the public
> [Metabase](https://www.metabase.com) demo sandbox (`demo.metabase.com`),
> an open-source BI/reporting tool, as a runnable stand-in for a private
> internal reporting application. Point `BASE_URL` at your actual internal
> tool and adjust the selectors in `pages/` to match its DOM — the
> structure (Page Object Model, tagged smoke/regression tests, Azure
> pipeline, shared test-case CSV) carries over directly.

## Project structure

```
.
├── tests/                       # Playwright specs (@smoke / @regression tagged)
│   ├── auth.setup.js            # Logs in once, saves session for all specs
│   ├── smoke.spec.js
│   ├── login.spec.js
│   ├── dashboard.spec.js
│   ├── report-creation.spec.js
│   ├── report-filters.spec.js
│   ├── report-export.spec.js
│   └── collections.spec.js
├── pages/                       # Page Object Model
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   ├── ReportBuilderPage.js
│   └── CollectionsPage.js
├── fixtures/test-data.json      # Reusable test data
├── utils/test-helpers.js        # Shared helper functions
├── test-case-repository/        # Shared manual + automated test case backlog
│   ├── regression-test-cases.csv
│   └── README.md
├── docs/TEST_STRATEGY.md        # Scope, approach, CI gating rationale
├── playwright.config.js
├── azure-pipelines.yml          # CI: smoke gate → full regression → publish results
├── package.json
└── .env.example
```

## Prerequisites

- Node.js 20+
- A QA test account for the target reporting application

## Setup

```bash
npm install
npx playwright install --with-deps
cp .env.example .env   # then fill in BASE_URL / QA_USERNAME / QA_PASSWORD
```

## Running tests

```bash
npm test                  # full suite, all configured browsers
npm run test:smoke        # fast @smoke health check only
npm run test:regression   # full @regression pass
npm run test:chromium     # any of the above, restricted to Chromium
npm run test:ui           # Playwright's interactive UI mode
npm run test:report       # open the last HTML report
```

Results:
- HTML report → `playwright-report/index.html`
- JUnit XML (for CI ingestion) → `test-results/junit/results.xml`
- Traces/screenshots/video for failures → `test-results/artifacts/`

## CI: Azure DevOps

`azure-pipelines.yml` defines two stages:

1. **Smoke** — installs dependencies, runs the `@smoke` tag on Chromium
   only, publishes JUnit results. Acts as a fast build-health gate.
2. **Regression** — runs only if Smoke passes; runs the full `@regression`
   tag across Chromium/Firefox/WebKit, publishes JUnit results plus the
   HTML report (and raw failure artifacts) as pipeline artifacts.

Triggers: on push to `main`/`release/*`, on PRs into `main`, and on a
weekday nightly schedule.

**Required setup before first run:** create a variable group named
`reporting-tool-qa` in Project Settings → Pipelines → Library with
`BASE_URL`, `QA_USERNAME`, and `QA_PASSWORD` (mark the password secret).

## Test case traceability

Every automated spec title starts with a `TC-###` ID that maps to a row in
[`test-case-repository/regression-test-cases.csv`](test-case-repository/regression-test-cases.csv).
That CSV is the shared backlog for both manual and automated QA — see
[`test-case-repository/README.md`](test-case-repository/README.md) for the
workflow.

## Adding new coverage

1. Add a row to `test-case-repository/regression-test-cases.csv` with a new
   `TC-###` ID.
2. Add locators to the relevant page object in `pages/` (or a new one).
3. Write the spec in `tests/`, tagged `@smoke` and/or `@regression`, with
   the `TC-###` ID in the test title.
4. Update the CSV row's `Automated` and `Automation Ref` columns.
