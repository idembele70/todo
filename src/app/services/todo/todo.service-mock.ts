import { Injectable } from '@angular/core';
import { v1 as id } from 'uuid';
import { TodoService } from './todo.service';
import { Todo } from '../../models/todo.model';

export const MOCK_TODOS: Todo[] = [
  {
    id: id(),
    content: 'the content',
    createdAt: new Date(),
    done: false,
  },
  {
    id: id(),
    content: 'the second content',
    createdAt: new Date(),
    done: true,
  },
];

@Injectable({
  providedIn: 'root',
})
export class TodoServiceMock extends TodoService {
  constructor() {
    super();
    this._todos = MOCK_TODOS;
  }

  public getOneTodo(id: string): Todo {
    return this._todos.find((todo) => todo.id === id)!;
  }
}
