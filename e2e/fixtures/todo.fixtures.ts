import { test as base } from '@playwright/test';
import HeaderComponent from '@pw-pages/components/header.component';
import TodoItemPage from '@pw-pages/todo-item.page';
import TodoListPage from '@pw-pages/todo-list.page';

interface TodoFixtures {
  headerComponent: HeaderComponent;
  todoListPage: TodoListPage;
  todoItemPage: TodoItemPage;
}

export const test = base.extend<TodoFixtures>({
  headerComponent: async ({ page }, use) => {
    const headerComponent = new HeaderComponent(page);
    use(headerComponent);
  },
  todoListPage: async ({ page }, use) => {
    const todoListPage = new TodoListPage(page);
    use(todoListPage);
  },
  todoItemPage: async ({ page }, use) => {
    const todoItemPage = new TodoItemPage(page);
    use(todoItemPage);
  },
});

export { expect, Locator } from '@playwright/test';
