import { expect, test } from '@pw-fixtures/todo.fixtures';

test.describe('Marking all todos as incomplete', { tag: '@TodoListPage' }, () => {
  const TODO_CONTENTS = ['My content', 'My second content'];

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();

    for (const content of TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }

    await todoListPage.completeAllTodosButton.check();
  });

  test('should mark all todos as incomplete todos in "All Todos" view', async ({ todoListPage }) => {
    await todoListPage.incompleteAllTodosCheckbox.uncheck();

    await expect(todoListPage.completedTodoRows).toHaveCount(0);
    await expect(todoListPage.completeAllTodosButton).not.toBeChecked();
    await expect(todoListPage.completeAllTodosButton).not.toBeDisabled();
  });

  test('should mark all todos as incomplete in "Completed Todos" view', async ({ todoListPage, headerComponent }) => {
    await headerComponent.navigateToCompleteTodosPage();
    await todoListPage.incompleteAllTodosCheckbox.uncheck();

    await expect(todoListPage.completedTodoRows).toHaveCount(0);
    await expect(todoListPage.completeAllTodosButton).not.toBeChecked();
    await expect(todoListPage.completeAllTodosButton).toBeDisabled();
  });
});
