import { fakerFR } from '@faker-js/faker';
import test, { Page } from '@playwright/test';
import { generateRandomContents } from '../helpers/todo.helpers';
import TodoListPage from '../pages/todo-list.page';
import HeaderComponent from '@pw-pages/components/header.component';

test.describe('View completed todos', { tag: '@TodoListPage' }, () => {
  let page: Page;
  let todoListPage: TodoListPage;
  let headerComponent: HeaderComponent;

  const TODO_COUNT = fakerFR.number.int({ min: 2, max: 4 });
  const COMPLETED_TODO_COUNT = 1;
  const TODO_CONTENTS = generateRandomContents(TODO_COUNT);

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    todoListPage = new TodoListPage(page);
    headerComponent = new HeaderComponent(page);

    await todoListPage.goToAllTodosPage();

    for (const content of TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }

    const completedTodoContent = TODO_CONTENTS[0];
    const todoRow = todoListPage.getTodoRowByContent(completedTodoContent);
    await todoListPage.completeTodo(todoRow);

    await headerComponent.navigateToCompleteTodosPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Should display only completed todos', async () => {
    await todoListPage.assertPageURL(todoListPage.completedTodosPageURL);
    await todoListPage.assertTodoCount(COMPLETED_TODO_COUNT);
  });
});
