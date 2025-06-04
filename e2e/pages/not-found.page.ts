import { Locator, Page } from '@playwright/test';

export default class NotFoundPage {
  private readonly page: Page;
  public readonly urlRegExp: RegExp;

  public readonly title: Locator;
  public readonly subTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.urlRegExp = /.*not-found$/;

    this.title = this.page.locator('h2');
    this.subTitle = this.page.locator('h5');
  }
}
