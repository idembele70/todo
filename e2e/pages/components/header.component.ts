import { Locator, Page } from '@playwright/test';

export default class HeaderComponent {
  constructor(private readonly page: Page) {}

  public readonly allTodosNavButton: Locator = this.page.getByRole('link', { name: 'All Todos' });
  public readonly activeTodosNavButton: Locator = this.page.getByRole('link', { name: 'Active Todos' });
  public readonly completeTodosNavButton: Locator = this.page.getByRole('link', { name: 'Completed Todos' });

  /**
   * Navigates to the "All Todos" page by clicking the corresponding navigation button.
   */
  public async navigateToAllTodosPage() {
    await this.allTodosNavButton.click();
  }

  /**
   * Navigates to the "Active Todos" page by clicking the corresponding navigation button.
   */
  public async navigateToActiveTodosPage() {
    await this.activeTodosNavButton.click();
  }

  /**
   * Navigates to the "Completed Todos" page by clicking the corresponding navigation button.
   */
  public async navigateToCompleteTodosPage() {
    await this.completeTodosNavButton.click();
  }
}
