import { expect, Locator, Page } from '@playwright/test';

export default class TodoListPage {
  private readonly page: Page;
  public readonly urlRegExp: RegExp;

  public readonly baseURL: string;
  public readonly allTodosPageURL: string;
  public readonly completedTodosPageURL: string;
  public readonly activeTodosPageURL: string;

  public readonly addTodoInputField: Locator;
  public readonly addButton: Locator;

  public readonly todoList: Locator;
  public readonly todoRows: Locator;

  public readonly editModeInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.baseURL = 'home/';
    this.urlRegExp = new RegExp(`.*/${this.baseURL}(all|completed|active)$`);
    this.allTodosPageURL = `${this.baseURL}all`;
    this.completedTodosPageURL = `${this.baseURL}completed`;
    this.activeTodosPageURL = `${this.baseURL}active`;

    this.addTodoInputField = this.page.locator('input[placeholder="What needs to be done?"]');
    this.addButton = this.page.getByRole('button', { name: 'Add', exact: true });

    this.todoList = this.page.locator('ul');
    this.todoRows = this.page.locator('li');

    this.editModeInput = this.page.getByTestId('edit-mode-input');
  }

  /**
   * Fills the input field with the provided text.
   *
   * @param {string} text - The text to type into the input field.
   */
  public async fillInput(text: string) {
    await this.addTodoInputField.fill(text);
  }

  /**
   * Asserts that the input field is empty.
   */
  public async assertEmptyInputValue() {
    const expectedEmptyValue = '';
    await expect(this.addTodoInputField).toHaveValue(expectedEmptyValue);
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
   * Presses the "Enter" key on the specified locator.
   * @param {Locator} locator - The element locator to receive the Enter key press.
   */
  public async pressEnter(locator: Locator) {
    await locator.press('Enter');
  }

  /**
   * Presses the "E" key on the specified locator.
   * @param {Locator} locator - The element locator to receive the "E" key press.
   */
  public async pressE(locator: Locator) {
    await locator.press('E');
  }

  /**
   * Asserts the current number of todos in the list.
   *
   * @param {number} expectedCount - The expected number of todos.
   */
  public async assertTodoCount(expectedCount: number) {
    await expect(this.todoRows).toHaveCount(expectedCount);
  }

  /**
   * Adds a new todo item and ensures it's visible in the list.
   *
   * @param {string} content - The text content of the todo to be added.
   */
  public async addTodo(content: string) {
    await this.fillInput(content);
    await this.pressEnter(this.addTodoInputField);

    const createdTodoRows = this.todoRows.getByText(content, { exact: true });
    await createdTodoRows.waitFor({ state: 'visible' });
  }

  /**
   * awaits a todo row by its exact text content.
   *
   * @param {string} content - The exact text of the todo item.
   * @awaits {Locator} - The locator of the todo row containing the given content.
   */
  public getTodoRowByContent(content: string): Locator {
    return this.todoRows.filter({ hasText: content });
  }

  /**
   * Hover over the the given todo row.
   * @param {Locator} todoRow - The locator of the todo row to hover.
   */
  public async hoverTodoRow(todoRow: Locator) {
    await todoRow.hover();
  }

  /**
   * Fills the input field for editing a todo item with the provided content.
   * @param {string} content - The new content to set in the edit input.
   */
  public async fillTodoEditInput(content: string) {
    await this.editModeInput.fill(content);
  }

  /**
   * Triggers a blur event on the edit mode input.
   */
  public async blurTodoEditInput() {
    await this.editModeInput.blur();
  }

  /**
   * Asserts that the edit mode input is hidden.
   */
  public async assertEditModeInputIsHidden() {
    await expect(this.editModeInput).toBeHidden();
  }

  /**
   * Asserts that the edit mode input is visible.
   */
  public async assertEditModeInputIsVisible() {
    await expect(this.editModeInput).toBeVisible();
  }

  /**
   * Asserts that the checkbox of the given todo row is visible.
   * @param {Locator} todoRow - The locator of the todo row.
   */
  public async assertTodoRowCheckboxIsVisible(todoRow: Locator) {
    const checkbox = todoRow.getByRole('checkbox');
    await expect(checkbox).toBeVisible();
  }

  /**
   * Asserts that the delete button of the given todo row is visible.
   * @param {Locator} todoRow - The locator of the todo row.
   */
  public async assertTodoRowDeleteButtonIsVisible(todoRow: Locator) {
    const closeButton = todoRow.locator('.btn-close');
    await expect(closeButton).toBeVisible();
  }

  /**
   * Edits the content of the given todo row.
   * @param {Locator} todoRow - The locator of the todo row to edit.
   * @param {string} content - The new content to set.
   */
  public async editTodoRowContent(todoRow: Locator, content: string) {
    await todoRow.dblclick();

    await this.editModeInput.fill(content);
    await this.editModeInput.blur();

    const updatedTodoRow = this.todoRows.filter({ hasText: content });
    await updatedTodoRow.waitFor({ state: 'visible' });
  }

  /**
   * Asserts that the given todo row is visible.
   * @param {Locator} todoRow  - The locator of the todo row.
   */
  public async assertTodoRowIsVisible(todoRow: Locator) {
    await expect(todoRow).toBeVisible();
  }

  /**
   * Redirects to the page where all todos are visible.
   */
  public async goToAllTodosPage() {
    await this.page.goto(this.allTodosPageURL);
  }

  /**
   * Redirects to the page where completed todos are visible.
   */
  public async goToCompletedTodosPage() {
    await this.page.goto(this.completedTodosPageURL);
  }

  /**
   * Redirects to the page where active todos are visible
   */
  public async goToActiveTodosPage() {
    await this.page.goto(this.activeTodosPageURL);
  }

  /**
   * Checks the checkbox pf the given todo row.
   * @param {Locator} todoRow - The locator of the todo row to complete.
   */
  public async completeTodo(todoRow: Locator) {
    const checkbox = todoRow.getByRole('checkbox');
    await checkbox.check();
  }

  /**
   * Asserts that the current page URL macthes the expected pattern.
   */
  public async assertPageURL() {
    await expect(this.page).toHaveURL(this.urlRegExp);
  }

  /**
   * Navigate using Tab to the given todo row content wrapper
   * @param {Locator} todoRow - The locator of the todo row.
   */
  public async navigateToTodoRowContentWithTab(todoRow: Locator) {
    const tabKey = 'Tab';
    await todoRow.press(tabKey);
    await todoRow.press(tabKey);
  }
}
