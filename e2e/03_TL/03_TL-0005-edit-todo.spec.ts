import test, { Page } from '@playwright/test';
import TodoListPage from '@pw-pages/todo-list.page';
import HeaderComponent from '@pw-pages/components/header.component';
import { generateRandomContent } from '@pw-helpers/todo.helpers';

test.describe('TodoList - Edit Todo', { tag: '@TodoListPage' }, () => {
  const TODO_CONTENT = generateRandomContent();
  const EDITED_CONTENT = generateRandomContent();

  test.describe('All Todos page', () => {
    let todoListPage: TodoListPage;
    test.beforeEach(async ({ page }) => {
      todoListPage = new TodoListPage(page);
      await todoListPage.goToAllTodosPage();

      await todoListPage.addTodo(TODO_CONTENT);
    });

    test('should allow the user to edit a todo content and save by pressing "Enter" key', async () => {
      let todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
      await todoRow.dblclick();

      await todoListPage.fillTodoEditInput(EDITED_CONTENT);
      await todoListPage.pressEnter(todoListPage.editModeInput);

      todoRow = todoListPage.getTodoRowByContent(EDITED_CONTENT);
      await todoListPage.assertTodoRowCheckboxIsVisible(todoRow);
      await todoListPage.hoverTodoRow(todoRow);
      await todoListPage.assertTodoRowDeleteButtonIsVisible(todoRow);
    });

    test('should allow user to delete a todo when input is cleared', async () => {
      const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
      await todoRow.dblclick();

      const emptyContent = '';
      await todoListPage.fillTodoEditInput(emptyContent);

      await todoListPage.blurTodoEditInput();

      await todoListPage.assertEditModeInputIsHidden();

      const expectedCount = 0;
      await todoListPage.assertTodoCount(expectedCount);
    });

    test('should enter edit mode when navigate todo content with Tab & key "E" is pressed', async () => {
      const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);

      await todoListPage.navigateToTodoRowContentWithTab(todoRow);
      await todoListPage.pressE(todoRow);

      await todoListPage.assertEditModeInputIsVisible();
    });
  });

  test.describe('Active Todos page', () => {
    test('should edit todo in active todos page', async ({ page }) => {
      const todoListPage = new TodoListPage(page);

      await todoListPage.goToActiveTodosPage();
      await todoListPage.assertPageURL();
      await todoListPage.addTodo(TODO_CONTENT);

      let todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
      await todoListPage.editTodoRowContent(todoRow, EDITED_CONTENT);

      todoRow = todoListPage.getTodoRowByContent(EDITED_CONTENT);
      await todoListPage.assertTodoRowIsVisible(todoRow);
    });
  });

  test.describe('Completed Todos page', () => {
    let page: Page;
    let todoListPage: TodoListPage;
    let headerComponent: HeaderComponent;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      todoListPage = new TodoListPage(page);
      headerComponent = new HeaderComponent(page);

      await todoListPage.goToAllTodosPage();
      await todoListPage.addTodo(TODO_CONTENT);
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should edit todo in completed todos page', async () => {
      let todoRow = todoListPage.getTodoRowByContent(TODO_CONTENT);
      await todoListPage.completeTodo(todoRow);

      await headerComponent.navigateToCompleteTodosPage();

      await todoListPage.editTodoRowContent(todoRow, EDITED_CONTENT);

      todoRow = todoListPage.getTodoRowByContent(EDITED_CONTENT);
      await todoListPage.assertTodoRowIsVisible(todoRow);
    });
  });
});
