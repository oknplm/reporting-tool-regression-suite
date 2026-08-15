const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

/**
 * Runs once before the chromium/firefox/webkit projects (see playwright.config.js
 * `dependencies`). Logs in a single time and persists the session to
 * playwright/.auth/user.json so every spec starts already authenticated,
 * which is both faster and closer to how QA actually exercises the app
 * post-login.
 */
const authFile = 'playwright/.auth/user.json';

setup('authenticate as QA user', async ({ page }) => {
  const username = process.env.QA_USERNAME;
  const password = process.env.QA_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'QA_USERNAME / QA_PASSWORD are not set. Copy .env.example to .env locally, ' +
        'or set them as secret pipeline variables in Azure DevOps.'
    );
  }

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(username, password);

  // Confirm we actually landed inside the app before saving state
  await expect(page).not.toHaveURL(/auth\/login/, { timeout: 15000 });

  await page.context().storageState({ path: authFile });
});
