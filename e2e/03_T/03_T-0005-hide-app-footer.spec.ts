import { expect, test } from '@pw-fixtures/todo.fixtures';

test.describe('Hide app footer', { tag: '@TodoItemPage' }, () => {
  const TODO_CONTENT = 'My content';

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();
    await todoListPage.addTodo(TODO_CONTENT);
    const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
    await todoListPage.navigateToTodoPage(todoRow);
  });

  test('Should hide footer on Todo details view', async ({ page, todoItemPage, footerComponent }) => {
    await expect(page).toHaveURL(todoItemPage.URLRegExp);

    await expect(footerComponent.container).toHaveCount(0);
  });

  test('Should display footer on All Todos view', async ({ page, todoListPage, headerComponent, footerComponent }) => {
    await headerComponent.navigateToAllTodosPage();

    await expect(page).toHaveURL(todoListPage.URLRegExp);

    await expect(footerComponent.container).toHaveCount(1);
  });
});
