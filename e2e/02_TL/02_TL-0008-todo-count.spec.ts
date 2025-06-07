import { expect, test } from '@pw-fixtures/todo.fixtures';
import { getItemCountText } from '@pw-helpers/footer.helper';
import FooterComponent from '@pw-pages/components/footer.component';

test.describe('footer item count display logic', { tag: '@TodoListPage' }, () => {
  const TODO_CONTENTS = ['My content', 'My second content'];

  test.beforeEach(async ({ todoListPage }) => {
    await todoListPage.goToAllTodosPage();

    for (const content of TODO_CONTENTS) {
      await todoListPage.addTodo(content);
    }
  });

  test('displays correct item count after adding and deleting todos', async ({ page, todoListPage }) => {
    const footerComponent = new FooterComponent(page);

    await test.step('Displays count with multiple todos', async () => {
      const expectedCount = 2;
      await expect(footerComponent.todoCount).toHaveText(getItemCountText(expectedCount));
    });

    await todoListPage.deleteTodoByContent(TODO_CONTENTS[0]);

    await test.step('Displays count after deletion', async () => {
      const expectedCount = 1;
      await expect(footerComponent.todoCount).toHaveText(getItemCountText(expectedCount));
    });
  });
});
