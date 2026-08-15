const { BasePage } = require('./BasePage');

/**
 * Encapsulates the "create a new report/question" flow: pick a data source,
 * run the query, apply a visualization, and export the result. This mirrors
 * the core ad-hoc reporting workflow analysts repeat every release.
 */
class ReportBuilderPage extends BasePage {
  constructor(page) {
    super(page);
    this.newMenuButton = page.getByRole('button', { name: /new/i });
    this.newQuestionOption = page.getByRole('menuitem', { name: /question/i });
    this.tableStepOption = page.getByText(/raw data|pick.*data/i).first();
    this.dataSourcePicker = page.locator('[data-testid="data-source-picker"], .DataSourceModal');
    this.runQueryButton = page.getByRole('button', { name: /run query|get answer|visualize/i });
    this.resultsTable = page.locator('[data-testid="query-visualization-root"], .Visualization');
    this.saveButton = page.getByRole('button', { name: /^save$/i });
    this.saveDialogNameInput = page.locator('input[name="name"]');
    this.saveConfirmButton = page.getByRole('button', { name: /^save$/i }).last();
    this.exportButton = page.locator('[aria-label="Download results"], [data-testid="download-button"]');
    this.exportCsvOption = page.getByText(/\.csv/i);
    this.exportPdfOption = page.getByText(/\.pdf/i);
    this.addFilterButton = page.getByRole('button', { name: /filter/i }).first();
  }

  async startNewReport() {
    await this.newMenuButton.click();
    await this.newQuestionOption.click();
  }

  async selectFirstAvailableTable() {
    await this.dataSourcePicker.waitFor({ state: 'visible', timeout: 10000 });
    const firstTable = this.page.locator('[data-testid="data-source-picker"] li, .List-item').first();
    await firstTable.click();
  }

  async runQuery() {
    await this.runQueryButton.click();
    await this.resultsTable.waitFor({ state: 'visible', timeout: 15000 });
  }

  async saveReport(name) {
    await this.saveButton.click();
    await this.saveDialogNameInput.fill(name);
    await this.saveConfirmButton.click();
    await this.waitForToast();
  }

  async exportAs(format = 'csv') {
    await this.exportButton.click();
    if (format === 'csv') {
      await this.exportCsvOption.click();
    } else if (format === 'pdf') {
      await this.exportPdfOption.click();
    }
  }

  async getResultRowCount() {
    return this.page.locator('table tbody tr').count();
  }
}

module.exports = { ReportBuilderPage };
