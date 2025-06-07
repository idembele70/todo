import { Locator, Page } from '@playwright/test';

export default class FooterComponent {
  constructor(private page: Page) {}

  readonly container: Locator = this.page.locator('footer');
  readonly todoCount: Locator = this.page.getByTestId('todo-count');
  readonly clearCompletedButton: Locator = this.page.getByRole('button', { name: 'Clear completed' });

  /**
   * Clicks the "Clear completed" button to delete all completed todos from the UI.
   */
  public async clickClearCompletedButton() {
    await this.clearCompletedButton.click();
  }
}
