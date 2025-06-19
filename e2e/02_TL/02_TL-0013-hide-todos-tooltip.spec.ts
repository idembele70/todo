import { expect, test } from '@pw-fixtures/todo.fixtures';

test.describe('Hide todos tooltip when navigating to todo details page', { tag: '@TodoListPage' }, () => {
  test.skip(
    true,
    'Impossible to cover this feature with e2e tests: hovering before navigation does not display the tooltip',
  );
  const TODO_CONTENT = ['My content', 'Another content'];

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();

    for (const content of TODO_CONTENT) {
      await todoListPage.addTodo(content);
    }
  });

  test('Should hide visible tooltip after navigation', async ({ todoListPage, page, todoItemPage }) => {
    const firstTodoRow = todoListPage.getTodoRowByContent(TODO_CONTENT[0]);
    const secondTodoRow = todoListPage.getTodoRowByContent(TODO_CONTENT[1]);

    await todoListPage.navigateToTodoPage(firstTodoRow);
    await secondTodoRow.hover();
    await expect(todoListPage.tooltip).toHaveCount(1);

    await expect(page).toHaveURL(todoItemPage.URLRegExp);
    await expect(todoListPage.tooltip).toHaveCount(0);
  });
});
