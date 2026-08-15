# Shared Test Case Repository

`regression-test-cases.csv` is the single source of truth for regression
coverage on the reporting tool. It is shared between manual QA and the
automated Playwright suite so nothing gets tested twice — or missed
entirely — across a release.

## How to use it

- **Manual QA** runs any row where `Automated = No` before a release sign-off,
  following the `Steps` / `Expected Result` columns.
- **Automated QA** (this repo) covers any row where `Automated = Yes`. The
  `Automation Ref` column points to the exact spec file that implements it,
  and the row's ID (e.g. `TC-020`) appears in a comment/test title inside
  that spec so the two stay traceable to each other.
- Import the CSV directly into **Azure Test Plans**, Excel, or a wiki table
  when planning a release — columns map 1:1 to Azure Test Plans' Title /
  Priority / Steps / Expected Result fields.

## Workflow when adding coverage

1. Add or update a row here first, including a unique `TC-###` ID.
2. If it's being automated, implement it in `tests/`, referencing the same
   `TC-###` ID in the test title (see existing specs for the pattern).
3. Set `Automated` to `Yes` and fill in `Automation Ref` once the spec is
   merged and passing in the Azure DevOps pipeline.
4. Leave `Automated = No` for cases that are exploratory, require visual
   judgment, or aren't yet worth automating — manual QA continues to own
   those every release.

## Columns

| Column | Meaning |
|---|---|
| Test Case ID | Stable ID referenced from both this sheet and automated spec titles |
| Area | Feature area (Authentication, Dashboard, Report Builder, etc.) |
| Priority | P1 (release-blocking) → P3 (nice-to-check) |
| Type | Smoke, Regression, or both |
| Automated | Whether Playwright currently covers this case |
| Automation Ref | File path to the Playwright spec, if automated |

Keeping this file in the same repo as the automation (rather than only in a
separate test-management tool) means a single pull request can update the
test case, the automated spec, and the pipeline config together.
