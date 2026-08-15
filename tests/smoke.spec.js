const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pages/DashboardPage');

/**
 * A deliberately tiny, fast-running check used as the pipeline's build
 * health gate: if this fails, the environment/deployment itself is broken
 * and the full regression pass is skipped to save CI time.
 */
test.describe('Application health @smoke', () => {
  test('TC-000 authenticated user lands on a working home page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();

    await expect(page).not.toHaveURL(/auth\/login/);
    await expect(page).toHaveTitle(/.+/);
  });
});
