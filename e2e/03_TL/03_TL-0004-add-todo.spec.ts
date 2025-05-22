import test, { expect } from '@playwright/test';
import TodoListPage from '../pages/todoList.page';

test.describe('TodoList - Add Todo', { tag: '@todoListPage' }, () => {
  const NO_TODOS = 0;
  const EXPECT_INPUT_VALUE_AFTER = '';

  test.beforeEach(async ({ page }) => {
    const todoListPage = new TodoListPage(page);
    await todoListPage.goToAllTodosPage();
  });

  test('should allow the user to add a new todo', async ({ page }) => {
    const todoListPage = new TodoListPage(page);
    const todoText = 'Add Todo by clicking';

    await todoListPage.fillInput(todoText);
    await todoListPage.clickAddButton();

    await expect(todoListPage.todoRows).toContainText(todoText);
    await expect(todoListPage.addTodoInputField).toHaveValue(EXPECT_INPUT_VALUE_AFTER);
    await todoListPage.assertAddButtonIsDisabled();
  });

  test('should not allow adding a todo if input is empty', async ({ page }) => {
    const todoListPage = new TodoListPage(page);

    await todoListPage.assertAddButtonIsDisabled();

    await todoListPage.assertTodoCount(NO_TODOS);
  });

  test('should not allow adding a todo if input is whitespace only', async ({ page }) => {
    const todoListPage = new TodoListPage(page);
    const todoText = '   ';

    await todoListPage.fillInput(todoText);

    await todoListPage.assertAddButtonIsDisabled();

    await todoListPage.assertTodoCount(NO_TODOS);
  });

  test('should not allow adding a duplicate todo', async ({ page }) => {
    const todoListPage = new TodoListPage(page);
    const todoText = 'No duplicate todo text';
    const expectedTodoCount = 1;

    await todoListPage.fillInput(todoText);
    await todoListPage.clickAddButton();

    await todoListPage.fillInput(todoText);
    await todoListPage.assertAddButtonIsDisabled();

    await todoListPage.assertTodoCount(expectedTodoCount);
  });

  test('should allow adding a todo by pressing Enter', async ({ page }) => {
    const todoListPage = new TodoListPage(page);
    const todoText = 'test todo Text via enter';

    await todoListPage.fillInput(todoText);
    await todoListPage.pressEnter(todoListPage.addTodoInputField);

    await expect(todoListPage.todoRows).toHaveText(todoText);

    await expect(todoListPage.addTodoInputField).toHaveValue(EXPECT_INPUT_VALUE_AFTER);

    await todoListPage.assertAddButtonIsDisabled();
  });
});
