import { expect, Locator, test } from '@pw-fixtures/todo.fixtures';
import TodoListPage from '../pages/todo-list.page';

test.describe('One click complete active todos', { tag: '@TodoListPage' }, () => {
  let todoRow: Locator;

  const TODO_CONTENTS = ['My content', 'My second content'];
  const TODO_COUNT = TODO_CONTENTS.length;
  const ACTIVE_VIEW_COMPLETED_TODO_COUNT = 0;

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();

    for (const content of TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }
  });

  test('Complete all todos with one click', async ({ todoListPage }) => {
    await todoListPage.completeAllTodosButton.click();

    await expect(todoListPage.completedTodoRows).toHaveCount(TODO_COUNT);
    await expect(todoListPage.completeAllTodosButton).toBeChecked();
    await expect(todoListPage.completeAllTodosButton).toBeDisabled();
  });

  test('disable checkbox If no todos exist', async ({ todoListPage }) => {
    await todoListPage.deleteTodoByContent(TODO_CONTENTS[0]);
    await todoListPage.deleteTodoByContent(TODO_CONTENTS[1]);

    await expect(todoListPage.completeAllTodosButton).toBeDisabled();
  });

  test('keep checkbox unchecked on Active view after completing all todos', async ({
    todoListPage,
    headerComponent,
  }) => {
    await headerComponent.navigateToActiveTodosPage();

    await todoListPage.completeAllTodosButton.click();

    await expect(todoListPage.completeAllTodosButton).not.toBeChecked();
    await expect(todoListPage.completedTodoRows).toHaveCount(ACTIVE_VIEW_COMPLETED_TODO_COUNT);
  });

  test('uncheck complete all todo checkbox if list contain active todos', async ({ todoListPage }) => {
    await todoListPage.completeAllTodosButton.click();

    const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENTS[0]);

    await todoListPage.uncompleteTodo(todoRow);

    await expect(todoListPage.completeAllTodosButton).not.toBeChecked();
  });
});
