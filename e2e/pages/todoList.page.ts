import { expect, Locator, Page } from '@playwright/test';

export default class TodoListPage {
  private readonly page: Page;
  public readonly urlPattern: RegExp;

  public inputField: Locator;
  public addButton: Locator;

  public todoList: Locator;
  public todoRow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.urlPattern = /.*#\/(all|completed|active)/;

    this.inputField = this.page.locator('input[placeholder="What needs to be done?"]');
    this.addButton = this.page.getByRole('button', { name: 'Add', exact: true });

    this.todoList = this.page.locator('ul');
    this.todoRow = this.page.locator('li');
  }

  /**
   * Fills the input field with the provided text.
   *
   * @param {string} text - The text to type into the input field.
   */
  public async fillInput(text: string) {
    await this.inputField.fill(text);
  }

  /**
   * Asserts that the input field is empty.
   */
  public async assertEmptyInputValue() {
    const expectedEmptyValue = '';
    await expect(this.inputField).toHaveValue(expectedEmptyValue);
  }

  /**
   * Clicks the "Add" button to submit a new todo item.
   */
  public async clickAddButton() {
    await this.addButton.click();
  }
  /**
   * Asserts that the add button is disabled.
   */

  public async assertAddButtonIsDisabled() {
    await expect(this.addButton).toBeDisabled();
  }

  /**
   * Press the "Enter" key to submit a new todo item.
   */
  public async pressEnter() {
    await this.inputField.press('Enter');
  }

  /**
   * Asserts the current number of todos in the list.
   *
   * @param {number} expectedCount - The expected number of todos.
   */
  public async assertTodoCount(expectedCount: number) {
    await expect(this.todoRow).toHaveCount(expectedCount);
  }
}
