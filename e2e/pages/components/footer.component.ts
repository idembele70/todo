import { Locator, Page } from '@playwright/test';

export default class FooterComponent {
  constructor(private page: Page) {}

  readonly container: Locator = this.page.locator('footer');
}
