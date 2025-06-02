import { expect, test } from '@pw-fixtures/todo.fixtures';
import { generateRandomContent } from '@pw-helpers/todo.helpers';

test.describe('Delete Todo Item', { tag: '@TodoItemPage' }, () => {
  const TODO_CONTENT = generateRandomContent();
  const EXPECTED_COUNT_AFTER_DELETION = 0;

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();

    await todoListPage.addTodo(TODO_CONTENT);

    const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
    await todoListPage.navigateToTodoPage(todoRow);
  });

  test('Should delete a todo and navigates to All Todos view', async ({ todoListPage, todoItemPage, page }) => {
    await todoItemPage.delete();

    await expect(page).toHaveURL(todoListPage.URLRegExp);

    const todoRows = todoListPage.todoRows;
    await expect(todoRows).toHaveCount(EXPECTED_COUNT_AFTER_DELETION);
  });
});
