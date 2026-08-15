const { test, expect } = require('@playwright/test');
const { ReportBuilderPage } = require('../pages/ReportBuilderPage');

test.describe('Report filtering @regression', () => {
  test.beforeEach(async ({ page }) => {
    const reportBuilder = new ReportBuilderPage(page);
    await reportBuilder.startNewReport();
    await reportBuilder.selectFirstAvailableTable();
    await reportBuilder.runQuery();
  });

  test('TC-030 adding a filter narrows the result set', async ({ page }) => {
    const reportBuilder = new ReportBuilderPage(page);
    const beforeCount = await reportBuilder.getResultRowCount();

    const hasFilter = await reportBuilder.addFilterButton.isVisible().catch(() => false);
    test.skip(!hasFilter, 'No filterable columns on this table in the current environment');

    await reportBuilder.addFilterButton.click();
    const firstColumn = page.locator('[role="listbox"] [role="option"], .List-item').first();
    await firstColumn.click();

    const applyBtn = page.getByRole('button', { name: /add filter|apply/i });
    await applyBtn.click();
    await reportBuilder.resultsTable.waitFor({ state: 'visible' });

    const afterCount = await reportBuilder.getResultRowCount();
    expect(afterCount).toBeLessThanOrEqual(beforeCount);
  });

  test('TC-031 clearing an applied filter restores the original result count', async ({ page }) => {
    const reportBuilder = new ReportBuilderPage(page);
    const originalCount = await reportBuilder.getResultRowCount();

    const hasFilter = await reportBuilder.addFilterButton.isVisible().catch(() => false);
    test.skip(!hasFilter, 'No filterable columns on this table in the current environment');

    await reportBuilder.addFilterButton.click();
    const firstColumn = page.locator('[role="listbox"] [role="option"], .List-item').first();
    await firstColumn.click();
    await page.getByRole('button', { name: /add filter|apply/i }).click();
    await reportBuilder.resultsTable.waitFor({ state: 'visible' });

    // Remove the filter chip
    const filterChip = page.locator('[data-testid="filter-pill"], .Filter').first();
    await filterChip.locator('button, [aria-label="Remove"]').first().click();
    await reportBuilder.resultsTable.waitFor({ state: 'visible' });

    const restoredCount = await reportBuilder.getResultRowCount();
    expect(restoredCount).toBe(originalCount);
  });
});
