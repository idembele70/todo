import test, { Page } from '@playwright/test';
import { APP_ROUTES } from '../../src/app/core/constants/app.routes';
import { generateRandomContents } from '../helpers/todo.helpers';
import TodoListPage from '../pages/todo-list.page';

test.describe('View all todos', { tag: '@TodoListPage' }, () => {
  let page: Page;
  let todoListPage: TodoListPage;

  const TODO_COUNT = 2;
  const TODO_CONTENTS = generateRandomContents(TODO_COUNT);

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    todoListPage = new TodoListPage(page);

    await todoListPage.goToAllTodosPage();

    for await (const content of TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }

    const secondTodoRow = todoListPage.getTodoRowByContent(TODO_CONTENTS[1]);
    await todoListPage.completeTodo(secondTodoRow);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test(`Should display all todo items on ${APP_ROUTES.HOME_ALL}`, async () => {
    await todoListPage.assertPageURL(todoListPage.allTodosPageURL);
    await todoListPage.assertTodoCount(TODO_COUNT);
  });
});
