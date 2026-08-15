const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.locator('input[name="username"], input[type="email"]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.submitButton = page.getByRole('button', { name: /sign in|log in/i });
    this.errorMessage = page.locator('[data-testid="login-error"], .text-error, .Form-message');
  }

  async open() {
    await this.goto('/auth/login');
  }

  async login(username, password) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoginError() {
    await this.errorMessage.first().waitFor({ state: 'visible', timeout: 8000 });
  }
}

module.exports = { LoginPage };
