const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const testData = require('../fixtures/test-data.json');

// Login runs unauthenticated, so this file intentionally overrides the
// default storageState from playwright.config.js.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication @smoke @regression', () => {
  test('TC-001 user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.QA_USERNAME, process.env.QA_PASSWORD);

    await expect(page).not.toHaveURL(/auth\/login/, { timeout: 15000 });
  });

  test('TC-002 invalid credentials show an inline error and block access', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(testData.users.invalid.username, testData.users.invalid.password);

    await loginPage.expectLoginError();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('TC-003 empty submission keeps the user on the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.submitButton.click();

    await expect(page).toHaveURL(/auth\/login/);
  });
});
