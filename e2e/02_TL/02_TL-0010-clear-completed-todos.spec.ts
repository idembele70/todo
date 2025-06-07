import { expect, test } from '@pw-fixtures/todo.fixtures';
import { getItemCountText } from '@pw-helpers/footer.helper';
import FooterComponent from '@pw-pages/components/footer.component';

test.describe('remove completed todos with a single click', { tag: '@TodoListPage' }, () => {
  const TODO_CONTENTS = ['My content', 'my second content'];

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();

    for (const content of TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }
  });

  test('remove all completed todos', async ({ todoListPage, page }) => {
    const todoRow = todoListPage.getTodoRowByContent(TODO_CONTENTS[0]);

    await todoListPage.completeTodo(todoRow);

    const footerComponent = new FooterComponent(page);

    await footerComponent.clickClearCompletedButton();

    await expect(footerComponent.todoCount).toHaveText(getItemCountText(1));
    await expect(todoRow).toBeHidden();
  });

  test('"Clear completed" is hidden if no completed todos', async ({ page }) => {
    const footerComponent = new FooterComponent(page);

    await expect(footerComponent.clearCompletedButton).toHaveCount(0);
  });
});
