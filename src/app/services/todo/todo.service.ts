import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { v1 as id } from 'uuid';
import { Path } from '../../models/path.type';
import { Todo } from '../../models/todo.model';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private _todos: Todo[] = [];

  private pathSubject = new BehaviorSubject<Path>('all');
  public readonly todoSubject = new BehaviorSubject<Todo[]>(this._todos);

  public readonly filteredTodos$: Observable<Todo[]> = combineLatest<[Path, Todo[]]>([
    this.pathSubject,
    this.todoSubject,
  ]).pipe(
    map(([path, todos]) => {
      switch (path) {
        case 'active':
          return todos.filter((todo) => todo.done === false);
        case 'completed':
          return todos.filter((todo) => todo.done === true);
        default:
          return todos;
      }
    }),
  );

  /**
   * Emits a copy of the current todo list trough `todosSubject`.
   *
   * @returns {void} No return value; performs an emission action.
   */
  public emitTodos = (): void => {
    this.todoSubject.next(this._todos.slice());
  };

  /**
   * Add a new todo with the provided text content.
   *
   * @param {string} content - the text content of the new todo.
   *
   * @returns {void} No return value; performs an action to add the todo.
   */
  public addTodo(content: string): void {
    this._todos.push({
      id: id(),
      content,
      createdAt: new Date(),
      done: false,
      updatedAt: undefined,
    });
    this.emitTodos();
  }

  /**
   * Check if a todo with the specified text content exists.
   *
   * @param {string} content - the text content of the todo to search for.
   *
   * @returns {boolean} `true` if a matching todo exists, otherwise false.
   */
  public todoExists(content: string): boolean {
    return !!this._todos.find((todo) => todo.content === content);
  }

  /**
   * Toggles the `todo` state of a todo by its ID.
   *
   * @param {string} id - ID of the todo to toggle.
   *
   * @returns {void} No return value; performs toggle todo completion.
   */
  public toggleCompletedTodo(id: string): void {
    const todo = this._todos.find((todo) => todo.id === id)!;
    todo.done = !todo.done;
    this.updateTodoTimestamp(todo.id);
  }

  /**
   * Delete a todo using its ID.
   *
   * @param {string} id - ID of the todo to delete.
   *
   * @returns {void} No return value; performs deletion action of a todo.
   */
  public deleteOneTodo(id: string): void {
    const index = this._todos.findIndex((todo) => todo.id === id);
    this._todos.splice(index, 1);
    this.emitTodos();
  }

  /**
   * Updates the content of a specific todo item by its ID.
   *
   * @param {string} id - The unique identifier of the todo to be updated.
   * @param {string} content - The new content to assign to the todo.
   *
   * @returns {void} No return value; performs a todo content update and emits the change.
   */
  public editContent(id: string, content: string): void {
    const todo = this._todos.find((todo) => todo.id === id)!;
    todo.content = content;
    this.updateTodoTimestamp(todo.id);
  }

  /**
   * Update the current path state for todo filtering.
   *
   * @param {Path} path - The selected path to apply ('all', 'active' or 'completed').
   *
   * @returns {void} No return value; emits the new path to subscribers.
   */
  public emitPath(path: Path): void {
    this.pathSubject.next(path);
  }

  /**
   * Retrieve a specific todo item by its unique identifier.
   *
   * @param {string} id - The ID of the todo item to retrieve.
   *
   * @returns {Observable<Todo | undefined>} An observable emitting the matched todo item if found, or `undefined` otherwise.
   */
  public getOneTodo(id: string): Observable<Todo | undefined> {
    return this.todoSubject.pipe(map((todos) => todos.find((todo) => todo.id === id)));
  }

  /**
   * Update the `updatedAt` timestamp of a specific todo item by its ID.
   *
   * @param {string} id - The ID of the todo item to update.
   *
   * @returns {void} No return value; performs the updates todo's `updatedAt` field.
   */
  public updateTodoTimestamp(id: string): void {
    const todo = this._todos.find((todo) => todo.id === id)!;
    todo.updatedAt = Date.now();
    this.emitTodos();
  }
}
