const { BasePage } = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.dashboardGrid = page.locator('[data-testid="dashboard-grid"], .DashboardGrid');
    this.dashboardCards = page.locator('[data-testid="dashboard-card"], .DashCard');
    this.dashboardTitle = page.locator('[data-testid="dashboard-name-heading"], h1, h2').first();
    this.searchInput = page.locator('input[placeholder*="Search" i]');
    this.newButton = page.getByRole('button', { name: /new/i });
    this.filterButton = page.getByRole('button', { name: /filter/i }).first();
    this.refreshButton = page.locator('[aria-label="Refresh"], button[title="Refresh"]');
  }

  async open() {
    await this.goto('/');
  }

  async openDashboardByName(name) {
    await this.searchInput.fill(name);
    await this.page.getByText(name, { exact: false }).first().click();
  }

  async expectDashboardLoaded() {
    await this.dashboardTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getVisibleCardCount() {
    return this.dashboardCards.count();
  }

  async applyFirstAvailableFilterValue() {
    await this.filterButton.click();
    const firstOption = this.page.locator('[role="listbox"] [role="option"], .SelectionModule li').first();
    await firstOption.waitFor({ state: 'visible', timeout: 8000 });
    await firstOption.click();
    await this.page.getByRole('button', { name: /add filter|apply/i }).click();
  }
}

module.exports = { DashboardPage };
