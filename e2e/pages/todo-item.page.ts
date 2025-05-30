import { expect, Page } from '@playwright/test';

export default class TodoItemPage {
  private readonly page: Page;
  public readonly URLRegExp: RegExp;

  constructor(page: Page) {
    this.page = page;
    this.URLRegExp = /todo\/[a-zA-Z0-9-]+$/;
  }

  /**
   * Asserts that the current page URL matches the expected pattern.
   */
  public async assertURL() {
    await expect(this.page).toHaveURL(this.URLRegExp);
  }
}
