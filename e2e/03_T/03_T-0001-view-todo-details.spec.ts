import test, { Locator, Page } from '@playwright/test';
import { generateRandomContent } from '@pw-helpers/todo.helpers';
import TodoItemPage from '../pages/todo-item.page';
import TodoListPage from '../pages/todo-list.page';

test.describe('View todo item detailed information', { tag: '@TodoItemPage' }, async () => {
  test.describe.configure({ mode: 'serial' });
  let page: Page;
  let todoListPage: TodoListPage;
  let todoItemPage: TodoItemPage;
  let todoRow: Locator;

  const TODO_CONTENT = generateRandomContent();
  const TODO_STATUS = 'incomplete';
  const IS_NEVER_UPDATED = true;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    todoListPage = new TodoListPage(page);
    todoItemPage = new TodoItemPage(page);

    await todoListPage.goToAllTodosPage();
    await todoListPage.addTodo(TODO_CONTENT);

    todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
  });

  test.afterAll(async () => {
    await todoListPage.close();
  });

  test('should navigates to todo detail page', async () => {
    await todoListPage.navigateToTodoPage(todoRow);

    await todoItemPage.assertURL();
  });

  test('should displays todo information', async () => {
    await todoItemPage.assertIdIsVisibleWithText();
    await todoItemPage.assertContentText(TODO_CONTENT);
    await todoItemPage.assertInputFieldHasValue(TODO_CONTENT);
    await todoItemPage.assertSaveButtonIsVisible();
    await todoItemPage.assertCompletionStatusText(TODO_STATUS);
    await todoItemPage.assertToggleCompletionButtonText(TODO_STATUS);
    await todoItemPage.assertDeleteButtonIsVisible();
    await todoItemPage.assertCreationDateContainsTodayWithTime();
    await todoItemPage.assertUpdateTimeHasText(IS_NEVER_UPDATED);
  });
});
