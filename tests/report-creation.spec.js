const { test, expect } = require('@playwright/test');
const { ReportBuilderPage } = require('../pages/ReportBuilderPage');
const { uniqueName } = require('../utils/test-helpers');

test.describe('Report creation @regression', () => {
  test('TC-020 analyst can create, run, and save a new report', async ({ page }) => {
    const reportBuilder = new ReportBuilderPage(page);
    const reportName = uniqueName('Regression Report');

    await reportBuilder.startNewReport();
    await reportBuilder.selectFirstAvailableTable();
    await reportBuilder.runQuery();

    const rowCount = await reportBuilder.getResultRowCount();
    expect(rowCount).toBeGreaterThan(0);

    await reportBuilder.saveReport(reportName);
    await expect(page.getByText(reportName)).toBeVisible();
  });

  test('TC-021 running a query without selecting a data source is blocked', async ({ page }) => {
    const reportBuilder = new ReportBuilderPage(page);
    await reportBuilder.startNewReport();

    await expect(reportBuilder.runQueryButton).toBeDisabled();
  });

  test('TC-022 result table reflects the same row count after a page refresh', async ({ page }) => {
    const reportBuilder = new ReportBuilderPage(page);
    await reportBuilder.startNewReport();
    await reportBuilder.selectFirstAvailableTable();
    await reportBuilder.runQuery();

    const initialCount = await reportBuilder.getResultRowCount();
    await page.reload();
    await reportBuilder.resultsTable.waitFor({ state: 'visible', timeout: 15000 });
    const afterReloadCount = await reportBuilder.getResultRowCount();

    expect(afterReloadCount).toBe(initialCount);
  });
});
