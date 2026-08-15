/**
 * BasePage
 * Shared helpers so individual page objects stay focused on locators/flows
 * rather than re-implementing waits, toasts, and navigation boilerplate.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.toast = page.locator('[data-testid="toast"], .Toastify__toast, [role="alert"]').first();
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async waitForToast(expectedText) {
    await this.toast.waitFor({ state: 'visible', timeout: 10000 });
    if (expectedText) {
      await this.page.getByText(expectedText, { exact: false }).waitFor({ state: 'visible' });
    }
  }

  async dismissOnboardingModalIfPresent() {
    const closeBtn = this.page.locator(
      'button[aria-label="Close"], [data-testid="modal-close-button"]'
    );
    if (await closeBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeBtn.first().click();
    }
  }

  async takeNamedScreenshot(name) {
    await this.page.screenshot({ path: `test-results/artifacts/${name}.png`, fullPage: true });
  }
}

module.exports = { BasePage };
