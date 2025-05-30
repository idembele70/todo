import test, { Locator } from '@playwright/test';
import TodoListPage from './pages/todo-list.page';

// Note: This test doesn't work !
test.describe('should describe the whole scenario', { tag: '@yourTag' }, () => {
  // Remove the following line to enable the test execution
  test.skip();

  // Variable names should follow camelCase convention.
  let todoListPage: TodoListPage;
  let todoRow: Locator;

  // Constant names should be written in SCREAMING_SNAKE_CASE.
  const TODO_CONTENT = 'My content';

  // Setup: Runs before each tests starts.
  test.beforeEach(async ({ page }) => {
    todoListPage = new TodoListPage(page);
    await todoListPage.goToAllTodosPage();

    await todoListPage.addTodo(TODO_CONTENT);

    // Add any additional setup code here...
  });

  // Cleanup: Runs at the end of each tests.
  test.afterEach(async () => {
    await todoListPage.hoverTodoRow(todoRow);
    await todoListPage.deleteTodo(todoRow);
    // Any additional cleanup code here...
  });

  // Test title must begin with "should"
  test('Should verify that setup has created one todo', async () => {
    const expectedCount = 1;

    await todoListPage.assertTodoCount(expectedCount);
  });

  // For sub-tests that require setup or cleanup, use test.describe to group them.
  test.describe('should modify active todo', () => {
    const CONTENT_EDITED = 'Edited content';

    // Setup: Runs before all tests have started.
    test.beforeAll(async ({ browser }) => {
      const page = await browser.newPage();

      todoListPage = new TodoListPage(page);
      await todoListPage.goToActiveTodosPage();

      await todoListPage.addTodo(TODO_CONTENT);

      todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);

      // Add any additional setup code here...
    });

    // Cleanup: Runs after all tests have finished.
    test.afterAll(async () => {
      await todoListPage.close();

      // Any additional cleanup code here...
    });
    test('should edit the active todo', async () => {
      await todoListPage.editTodoRowContent(todoRow, CONTENT_EDITED);
    });
  });
});
