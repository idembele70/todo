import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v1 as id } from 'uuid';
import { Todo } from '../../models/todo';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public todoSubject = new Subject<Todo[]>();
  private _todos: Todo[] = [
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

  /**
   * Check if a todo with the specified text content exists.
   * 
   * @param {string} content - the text content of the todo to search for.
   * 
   * @returns {boolean} `true` if a matching todo exists, otherwise false.
   */
  public todoExists(content: string): boolean {
    return !!this._todos.find(todo => todo.content === content)
  }

  /**
   * Toggles the `todo` state of a todo by its ID.
   * 
   * @param {string} id - ID of the todo to toggle.
   * 
   * @returns {boolean} The new `done` state
   */
  public toggleCompletedTodo(id: string): boolean {
    const todo = this._todos.find(todo => todo.id === id)!;
    todo.done = !todo.done;
    return todo.done;
  }

  /**
   * Delete a todo using its ID.
   * 
   * @param {string} id - ID of the todo to delete.
   * 
   * @returns {void} No return value; performs deletion action of a todo.
   */
  public deleteOneTodo(id: string): void {
    const index = this._todos.findIndex(todo => todo.id === id);
    this._todos.splice(index, 1);
  }
}
