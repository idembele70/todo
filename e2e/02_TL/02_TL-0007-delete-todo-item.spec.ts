import test, { expect } from '@playwright/test';
import TodoListPage from '@pw-pages/todo-list.page';
import { generateRandomContent } from '@pw-helpers/todo.helpers';
import HeaderComponent from '@pw-pages/components/header.component';

test.describe('Todo deletion from All, Active & Completed views', { tag: '@TodoListPage' }, () => {
  const TODO_CONTENT = generateRandomContent();
  const TODO_COUNT_AFTER_DELETION = 0;

  test.beforeEach(async ({ page }) => {
    const todoListPage = new TodoListPage(page);
    await todoListPage.goToAllTodosPage();

    await todoListPage.addTodo(TODO_CONTENT);
  });

  test('should delete a todo from All Todos view', async ({ page }) => {
    const todoListPage = new TodoListPage(page);

    await todoListPage.deleteTodoByContent(TODO_CONTENT);

    const todoRows = todoListPage.todoRows;
    await expect(todoRows).toHaveCount(TODO_COUNT_AFTER_DELETION);
  });

  test('should delete a todo from Active Todos view', async ({ page }) => {
    const todoListPage = new TodoListPage(page);
    const headerComponent = new HeaderComponent(page);

    await headerComponent.navigateToActiveTodosPage();

    await todoListPage.deleteTodoByContent(TODO_CONTENT);

    const todoRows = todoListPage.todoRows;
    await expect(todoRows).toHaveCount(TODO_COUNT_AFTER_DELETION);
  });

  test('should delete a todo from Completed Todos view', async ({ page }) => {
    const todoListPage = new TodoListPage(page);
    const headerComponent = new HeaderComponent(page);

    const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);

    await todoListPage.completeTodo(todoRow);

    await headerComponent.navigateToCompleteTodosPage();

    await todoListPage.deleteTodoByContent(TODO_CONTENT);

    const todoRows = todoListPage.todoRows;
    await expect(todoRows).toHaveCount(TODO_COUNT_AFTER_DELETION);
  });
});
