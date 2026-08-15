const { test, expect } = require('@playwright/test');
const { CollectionsPage } = require('../pages/CollectionsPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { uniqueName } = require('../utils/test-helpers');

test.describe('Shared report collections @regression', () => {
  test('TC-050 QA can create a new collection to organize regression reports', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();

    const collectionsPage = new CollectionsPage(page);
    await collectionsPage.open();

    const collectionName = uniqueName('QA Regression Collection');
    await collectionsPage.createCollection(collectionName);
    await collectionsPage.expectItemVisible(collectionName);
  });

  test('TC-051 archiving a saved report removes it from the active list', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();

    const collectionsPage = new CollectionsPage(page);
    await collectionsPage.open();

    const firstRow = collectionsPage.itemRows.first();
    const hasItems = await firstRow.isVisible().catch(() => false);
    test.skip(!hasItems, 'No existing saved items to archive in this environment');

    const itemName = (await firstRow.textContent())?.trim() ?? '';
    await collectionsPage.archiveItemByName(itemName);

    await expect(page.getByText(itemName, { exact: true })).toHaveCount(0);
  });
});
