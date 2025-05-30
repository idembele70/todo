import { fakerFR } from '@faker-js/faker';
import { Todo } from '../../models/todo.model';

export const createEmptyTodo = (): Todo => {
  return {
    id: '',
    content: '',
    createdAt: new Date(),
    done: false,
  };
};

export const createRandomTodo = (): Todo => {
  return {
    id: fakerFR.string.uuid(),
    content: fakerFR.lorem.sentence(2),
    createdAt: fakerFR.date.recent(),
    done: false,
  };
};

export const createRandomContentTodo = (): string => {
  return fakerFR.lorem.sentence(2);
};
