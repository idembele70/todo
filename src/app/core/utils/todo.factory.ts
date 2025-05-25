import { Todo } from '../../models/todo.model';

export const createEmptyTodo = (): Todo => {
  return {
    id: '',
    content: '',
    createdAt: new Date(),
    done: false,
  };
};
