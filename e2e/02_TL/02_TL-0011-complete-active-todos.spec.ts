import { expect, test } from '@pw-fixtures/todo.fixtures';

test.describe('One click complete active todos', { tag: '@TodoListPage' }, () => {
  const TODO_CONTENTS = ['My content', 'My second content'];
  const TODO_COUNT = TODO_CONTENTS.length;
  const ACTIVE_VIEW_COMPLETED_TODO_COUNT = 0;

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();

    for (const content of TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }
  });

  test('should complete all active todos with one click on "All Todos" page', async ({ todoListPage }) => {
    await todoListPage.completeAllTodosButton.check();

    await expect(todoListPage.completedTodoRows).toHaveCount(TODO_COUNT);
    await expect(todoListPage.completeAllTodosButton).toBeHidden();
    await expect(todoListPage.incompleteAllTodosCheckbox).toBeChecked();
    await expect(todoListPage.incompleteAllTodosCheckbox).not.toBeDisabled();
  });

  test('should disable checkbox If no todos exist', async ({ todoListPage }) => {
    await todoListPage.deleteTodoByContent(TODO_CONTENTS[0]);
    await todoListPage.deleteTodoByContent(TODO_CONTENTS[1]);

    await expect(todoListPage.completeAllTodosButton).toBeDisabled();
    await expect(todoListPage.completeAllTodosButton).not.toBeChecked();
  });

  test('should keep checkbox unchecked on Active view after completing all todos', async ({
    todoListPage,
    headerComponent,
  }) => {
    await headerComponent.navigateToActiveTodosPage();

    await todoListPage.completeAllTodosButton.click();

    await expect(todoListPage.completeAllTodosButton).not.toBeChecked();
    await expect(todoListPage.completeAllTodosButton).toBeDisabled();
    await expect(todoListPage.completedTodoRows).toHaveCount(ACTIVE_VIEW_COMPLETED_TODO_COUNT);
  });

  test('should uncheck checkbox if list contain active todos', async ({ todoListPage }) => {
    await todoListPage.completeAllTodosButton.check();

    const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENTS[0]);

    await todoListPage.uncompleteTodo(todoRow);

    await expect(todoListPage.completeAllTodosButton).not.toBeChecked();
  });
});
