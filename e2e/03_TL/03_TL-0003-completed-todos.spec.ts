import { fakerFR } from '@faker-js/faker';
import test, { Page } from '@playwright/test';
import { generateRandomContents } from '../helpers/todo.helpers';
import TodoListPage from '../pages/todo-list.page';
import { APP_ROUTES } from '../../src/app/core/constants/app.routes';

test.describe('View completed todos', { tag: '@TodoListPage' }, () => {
  test.skip(true, `No data persistence or route from ${APP_ROUTES.HOME_ALL} to ${APP_ROUTES.HOME_COMPLETED}`);
  let page: Page;
  let todoListPage: TodoListPage;

  const TODO_COUNT = fakerFR.number.int({ min: 2, max: 4 });
  const COMPLETED_TODO_COUNT = 0;
  const TODO_CONTENTS = generateRandomContents(TODO_COUNT);

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    todoListPage = new TodoListPage(page);
    await todoListPage.goToCompletedTodosPage();

    for (const content of TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }
  });

  test.afterAll(async () => {
    await todoListPage.close();
  });

  test('Should display only completed todos', async () => {
    await todoListPage.assertPageURL(todoListPage.completedTodosPageURL);
    await todoListPage.assertTodoCount(COMPLETED_TODO_COUNT);
  });
});
