import test, { Locator, Page } from '@playwright/test';
import TodoListPage from '@pw-pages/todoList.page';
import { fakerFR } from '@faker-js/faker';

test.describe("Toggle todo item's completion status", { tag: '@TodoListPage' }, () => {
  let page: Page;
  let todoListPage: TodoListPage;
  let todoRow: Locator;

  const WORD_COUNT = 2;
  const TODO_CONTENT = fakerFR.lorem.sentence(WORD_COUNT);

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    todoListPage = new TodoListPage(page);
    await todoListPage.goToAllTodosPage();

    await todoListPage.addTodo(TODO_CONTENT);
    todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
  });

  test.afterAll(async () => {
    await todoListPage.close();
  });

  test('should check a todo item', async () => {
    await todoListPage.completeTodo(todoRow);
    await todoListPage.assertTodoIsCompleted(todoRow);
  });

  test('should uncheck a todo item', async () => {
    await todoListPage.inCompleteTodo(todoRow);
    await todoListPage.assertTodoIsIncomplete(todoRow);
  });
});
