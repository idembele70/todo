import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Todo } from '../../models/todo';
import { v1 as id } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public todoSubject = new Subject<Todo[]>();
  private _todos: Todo[] = [
    {
      id: id(),
      content: 'My first todo content',
      createdAt: new Date(),
      done: false
    },
    {
      id: id(),
      content: 'My second todo content',
      createdAt: new Date(),
      done: false
    },
  ];

  constructor() { }

  /**
   * Emits a copy of the current todo list trough `todosSubject`.
   * 
   * @returns {void} No return value; performs an emission action.
   */
  public emitTodos = (): void => {
    this.todoSubject.next(this._todos.slice());
  }

  /**
   * Add a new todo with the provided text content.
   * 
   * @param {string} content - the text content of the new todo.
   * 
   * @returns {void} No return value; performs an action to add the todo.
   */
  public addTodo(content: string): void {
    this._todos.push(
      {
        id: id(),
        content,
        createdAt: new Date(),
        done: false
      }
    )
  }
}
