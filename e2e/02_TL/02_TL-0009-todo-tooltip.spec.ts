import { expect, test } from '@pw-fixtures/todo.fixtures';

test.describe('tooltip behavior on todo toggle and unhover', { tag: '@TodoListPage' }, () => {
  const TODO_CONTENT = 'My content';

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();

    await todoListPage.addTodo(TODO_CONTENT);
  });

  test('hides tooltip after completing a todo and unhovering', async ({ todoListPage }) => {
    const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);

    await todoListPage.hoverTodoRow(todoRow);
    await todoListPage.completeTodo(todoRow);
    await todoListPage.unHover();

    await expect(todoListPage.tooltip).toHaveCount(0);
  });

  test('hides tooltip after uncompleting a todo and unhovering', async ({ todoListPage, page }) => {
    const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
    await todoListPage.completeTodo(todoRow);

    await todoListPage.hoverTodoRow(todoRow);
    await todoListPage.inCompleteTodo(todoRow);
    await todoListPage.unHover();

    await expect(todoListPage.tooltip).toHaveCount(0);
  });
});
