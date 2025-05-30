import { US_DATE_TIME_REGEX, US_TIME_REGEX } from '@constants/date-format';
import { expect, Locator, Page } from '@playwright/test';

export default class TodoItemPage {
  private readonly page: Page;
  public readonly URLRegExp: RegExp;

  public readonly id: Locator;
  public readonly content: Locator;
  public readonly inputField: Locator;
  public readonly saveButton: Locator;
  public readonly completionStatus: Locator;
  public readonly toggleCompletionButton: Locator;
  public readonly deleteButton: Locator;
  public readonly creationDate: Locator;
  public readonly updatedDate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.URLRegExp = /todo\/[a-zA-Z0-9-]+$/;

    this.id = this.page.locator('.card-header');
    this.content = this.page.locator('.card-title');
    this.inputField = this.page.locator('input');
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.completionStatus = this.page.locator('.card-text');
    this.toggleCompletionButton = this.page.getByRole('button', { name: /(Inc|C)omplete/ });
    this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
    this.creationDate = this.page.locator('.card-footer > div :has-text("Created")');
    this.updatedDate = this.page.locator('.card-footer > div :has-text("Update")');
  }

  /**
   * Asserts that the current page URL matches the expected pattern.
   */
  public async assertURL() {
    await expect(this.page).toHaveURL(this.URLRegExp);
  }

  /**
   * Asserts that the ID locator is visible & contains non-empty text.
   */
  public async assertIdIsVisibleWithText() {
    await expect(this.id).toBeVisible();
    await expect(this.id).toHaveText(/.+/g);
  }

  /**
   * Asserts that the content element contains the expected text.
   * @param {string} text - The expected text.
   */
  public async assertContentText(text: string) {
    await expect(this.content).toHaveText(text);
  }

  /**
   * Asserts that the input field contains the expected value.
   * @param {string} value - The expected input value.
   */
  public async assertInputFieldHasValue(value: string) {
    await expect(this.inputField).toHaveValue(value);
  }

  /**
   * Asserts that the save button is visible.
   */
  public async assertSaveButtonIsVisible() {
    await expect(this.saveButton).toBeVisible();
  }

  /**
   * Asserts that the completion status displays the correct message
   * based on the provided status.
   * @param {string} status - The expected status value ('complete' or 'incomplete').
   */
  public async assertCompletionStatusText(status: 'complete' | 'incomplete') {
    const expectedText = 'This todo is ' + (status === 'complete' ? 'done' : 'not done');
    await expect(this.completionStatus).toHaveText(expectedText);
  }

  /**
   * Asserts that toggle completion button displays the correct text
   * based on the given status value.
   * @param {string} status - The expected status value ('complete' or 'incomplete').
   */
  public async assertToggleCompletionButtonText(status: 'complete' | 'incomplete') {
    const expectedText = (status === 'incomplete' ? 'C' : 'Inc') + 'omplete';
    await expect(this.toggleCompletionButton).toHaveText(expectedText);
  }

  /**
   * Asserts that the delete button is visible.
   */
  public async assertDeleteButtonIsVisible() {
    await expect(this.deleteButton).toBeVisible();
  }

  /**
   * Asserts that the creation date element contains today's date &
   *  valid 12-hour time.
   */
  public async assertCreationDateContainsTodayWithTime() {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const todayDate = new Date().toLocaleDateString('en-US', options);

    await expect(this.creationDate).toContainText(todayDate);
    await expect(this.creationDate).toHaveText(/^Created: /);
    await expect(this.creationDate).toHaveText(US_TIME_REGEX);
  }

  /**
   * Asserts that the update time element shows either a "never updated" message
   * or a correctly formatted date-time string.
   * @param {boolean} isNeverUpdated - Wether the element should contain the "never updated" message.
   */
  public async assertUpdateTimeHasText(isNeverUpdated?: boolean) {
    if (isNeverUpdated) {
      await expect(this.updatedDate).toHaveText('Updated: Never updated');
      return;
    }

    await expect(this.updatedDate).toHaveText(/^Updated: /);
    await expect(this.updatedDate).toHaveText(US_DATE_TIME_REGEX);
  }
}
