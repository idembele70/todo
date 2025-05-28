import { fakerFR } from '@faker-js/faker';
import test, { Page } from '@playwright/test';
import { generateRandomContents } from '../helpers/todo.helpers';
import TodoListPage from '../pages/todoList.page';

test.describe('View active todos', { tag: '@TodoListPage' }, () => {
  let page: Page;
  let todoListPage: TodoListPage;

  const TODO_COUNT = fakerFR.number.int({ min: 3, max: 5 });
  const ALL_TODO_CONTENTS = generateRandomContents(TODO_COUNT);
  const COMPLETED_TODO_COUNT = fakerFR.number.int({
    min: 1,
    max: 2,
  });
  const NUMBER_OF_ACTIVE_TODO = TODO_COUNT - COMPLETED_TODO_COUNT;
  const ACTIVE_TODOS_TEXT = ALL_TODO_CONTENTS.slice(COMPLETED_TODO_COUNT);

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    todoListPage = new TodoListPage(page);
    await todoListPage.goToActiveTodosPage();

    for (const content of ALL_TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }

    for (let index = 0; index < COMPLETED_TODO_COUNT; index++) {
      const currentTodoRow = todoListPage.getTodoRowByContent(ALL_TODO_CONTENTS[index]);
      await todoListPage.completeTodo(currentTodoRow);
    }
  });

  test.afterAll(async () => {
    await todoListPage.close();
  });

  test('Should display only uncompleted (active) todos', async () => {
    await todoListPage.assertTodoCount(NUMBER_OF_ACTIVE_TODO);
    await todoListPage.assertTodoRowsText(ACTIVE_TODOS_TEXT);
  });
});
