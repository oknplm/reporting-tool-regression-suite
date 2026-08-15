const { test, expect } = require('@playwright/test');
const { ReportBuilderPage } = require('../pages/ReportBuilderPage');
const { captureDownloadFilename } = require('../utils/test-helpers');
const testData = require('../fixtures/test-data.json');

test.describe('Report export @regression', () => {
  test.beforeEach(async ({ page }) => {
    const reportBuilder = new ReportBuilderPage(page);
    await reportBuilder.startNewReport();
    await reportBuilder.selectFirstAvailableTable();
    await reportBuilder.runQuery();
  });

  for (const format of testData.exportFormats) {
    test(`TC-04${format === 'csv' ? '0' : '1'} exporting results as .${format} downloads a file`, async ({
      page,
    }) => {
      const reportBuilder = new ReportBuilderPage(page);

      const filename = await captureDownloadFilename(page, async () => {
        await reportBuilder.exportAs(format);
      });

      expect(filename.toLowerCase()).toContain(`.${format}`);
    });
  }

  test('TC-042 export menu closes without downloading when dismissed', async ({ page }) => {
    const reportBuilder = new ReportBuilderPage(page);
    await reportBuilder.exportButton.click();
    await page.keyboard.press('Escape');

    await expect(reportBuilder.exportCsvOption).not.toBeVisible();
  });
});
