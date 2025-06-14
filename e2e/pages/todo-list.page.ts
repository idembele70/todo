import { expect, Locator, Page } from '@playwright/test';
import { BOOTSTRAP_CSS_CLASSES } from '@constants/bootstrap-css-classes.enum';

export default class TodoListPage {
  private readonly page: Page;
  public readonly URLRegExp: RegExp;

  public readonly baseURL: string;
  public readonly allTodosPageURL: string;
  public readonly completedTodosPageURL: string;
  public readonly activeTodosPageURL: string;

  public readonly completeAllTodosButton: Locator;
  public readonly addTodoInputField: Locator;
  public readonly addButton: Locator;

  public readonly todoList: Locator;
  public readonly todoRows: Locator;
  public readonly completedTodoRows: Locator;

  public readonly editModeInput: Locator;

  public readonly tooltip: Locator;

  constructor(page: Page) {
    this.page = page;

    this.baseURL = 'home/';
    this.URLRegExp = new RegExp(`.*/${this.baseURL}(all|completed|active)$`);
    this.allTodosPageURL = `${this.baseURL}all`;
    this.completedTodosPageURL = `${this.baseURL}completed`;
    this.activeTodosPageURL = `${this.baseURL}active`;

    this.completeAllTodosButton = this.page.getByRole('checkbox', { name: 'marks all active todos as completed' });
    this.addTodoInputField = this.page.locator('input[placeholder="What needs to be done?"]');
    this.addButton = this.page.getByRole('button', { name: 'Add', exact: true });

    this.todoList = this.page.locator('ul');
    this.todoRows = this.page.locator('li');

    this.completedTodoRows = this.page.locator('.completed');

    this.editModeInput = this.page.getByTestId('edit-mode-input');

    this.tooltip = this.page.locator('.tooltip');
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
   * Asserts all todos in the displayed list contents.
   * @param {string[]} texts - An array containing expected texts.
   */
  public async assertTodoRowsText(texts: string[]) {
    await expect(this.todoRows).toHaveText(texts);
  }

  /**
   * Adds a new todo item and ensures it's visible in the list.
   *
   * @param {string} content - The text content of the todo to be added.
   */
  public async addTodo(content: string) {
    await this.fillInput(content);
    await this.pressEnter(this.addTodoInputField);

    const createdTodoRow = this.todoRows.getByText(content, { exact: true });
    await createdTodoRow.waitFor({ state: 'visible' });
  }

  /**
   * Delete the specified todo row from the list.
   * @param {Locator} todoRow - The locator of the todo row element to delete.
   */
  public async deleteTodo(todoRow: Locator) {
    const closeButton = todoRow.locator('.btn-close');

    await closeButton.click();

    await todoRow.waitFor({ state: 'hidden' });
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
   * Simulates unhovering by moving the mouse away from the currently hovered element.
   */
  public async unHover() {
    await this.page.mouse.move(0, 0);
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
    const checkbox = this.getTodoRowCheckbox(todoRow);
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
    await expect(this.editModeInput).toBeVisible();
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
   * Checks the checkbox of the given todo row.
   * @param {Locator} todoRow - The locator of the todo row to complete.
   */
  public async completeTodo(todoRow: Locator) {
    const checkbox = this.getTodoRowCheckbox(todoRow);
    await checkbox.check();
  }

  /**
   * Asserts that the given todo row is marked as completed.
   * @param {Locator} todoRow - The locator of the todo row.
   */
  public async assertTodoIsCompleted(todoRow: Locator) {
    const checkbox = this.getTodoRowCheckbox(todoRow);
    await expect(checkbox).toBeChecked();

    const content = this.getTodoRowContent(todoRow);
    await expect(content).toContainClass(BOOTSTRAP_CSS_CLASSES.COMPLETED);
  }

  /**
   * uncheck the checkbox of given todo row.
   * @param {Locator} todoRow - The locator of the todo row.
   */
  public async uncompleteTodo(todoRow: Locator) {
    const checkbox = this.getTodoRowCheckbox(todoRow);
    await checkbox.uncheck();
  }

  /**
   * Asserts that a given todo row is marked as incomplete.
   * @param {Locator} todoRow - The locator of the todo row.
   */
  public async assertTodoIsIncomplete(todoRow: Locator) {
    const checkbox = this.getTodoRowCheckbox(todoRow);
    await expect(checkbox).not.toBeChecked();

    const content = this.getTodoRowContent(todoRow);
    await expect(content).not.toContainClass(BOOTSTRAP_CSS_CLASSES.COMPLETED);
  }

  /**
   * Asserts that the current page URL matches a given url or expected pattern.
   *
   * @param {string} url - Optional relative path to assert against.
   */
  public async assertPageURL(url?: string) {
    if (!url) {
      await expect(this.page).toHaveURL(this.URLRegExp);
      return;
    }

    await expect(this.page).toHaveURL(url);
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

  /**
   * Close the current browser page instance.
   */
  public async close() {
    await this.page.close();
  }

  /**
   * Navigate to the detailed page of a specific Todo item.
   * @param {Locator} todoRow - The locator of the todo row.
   */
  public async navigateToTodoPage(todoRow: Locator) {
    const todoContent = this.getTodoRowContent(todoRow);
    await todoContent.click();
  }

  /**
   * Deletes a todo by content after hovering it.
   * @param {string} content - The todo content to target.
   */
  public async deleteTodoByContent(content: string) {
    const todoRow = this.getTodoRowByContent(content);
    await this.hoverTodoRow(todoRow);
    await this.deleteTodo(todoRow);
  }

  //---------------------------------
  // DRY FUNCTIONS
  //---------------------------------

  /**
   * Returns the checkbox locator inside a given todo row.
   * @param {Locator} todoRow - The locator of the todo row.
   */

  private getTodoRowCheckbox(todoRow: Locator) {
    return todoRow.getByRole('checkbox');
  }

  /**
   * Returns the locator for the content label within the given todo row.
   * @param {Locator} todoRow - The locator of the todo row.
   */
  private getTodoRowContent(todoRow: Locator) {
    return todoRow.locator('label');
  }
}
