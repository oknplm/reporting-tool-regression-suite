const { BasePage } = require('./BasePage');

/**
 * Collections act as the shared "folder" structure where saved/regression
 * reports live so the wider QA + analyst team can find and re-run them.
 */
class CollectionsPage extends BasePage {
  constructor(page) {
    super(page);
    this.sidebarCollectionsLink = page.getByRole('link', { name: /collections/i });
    this.itemRows = page.locator('[data-testid="collection-entry"], tr');
    this.newCollectionButton = page.getByRole('button', { name: /new collection/i });
    this.collectionNameInput = page.locator('input[name="name"]');
    this.createButton = page.getByRole('button', { name: /^create$/i });
    this.moveButton = page.getByRole('button', { name: /move/i });
    this.archiveButton = page.getByRole('button', { name: /archive/i });
  }

  async open() {
    await this.sidebarCollectionsLink.click();
  }

  async createCollection(name) {
    await this.newCollectionButton.click();
    await this.collectionNameInput.fill(name);
    await this.createButton.click();
    await this.waitForToast();
  }

  async expectItemVisible(name) {
    await this.page.getByText(name, { exact: false }).first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async archiveItemByName(name) {
    const row = this.page.locator('tr', { hasText: name }).first();
    await row.hover();
    await row.locator('[aria-label="More options"], button[title="More"]').click();
    await this.archiveButton.click();
  }
}

module.exports = { CollectionsPage };
