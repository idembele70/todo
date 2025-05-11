import { TestBed } from '@angular/core/testing';
import { Todo } from '../../models/todo.model.';
import { TodoService } from './todo.service';
import { v1 as id } from 'uuid';

describe('TodoService', () => {
  let todoService: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    todoService = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(todoService).toBeTruthy();
  });

  it('should add todo', () => {
    const content = 'Test todo';
    todoService.addTodo(content);
    expect(todoService['_todos'].length).toBe(1);
    expect(todoService['_todos'][0].content).toEqual(content);
  });

  it('should return true if todo exists', () => {
    const content = 'Existing todo';
    todoService.addTodo(content);
    expect(todoService.todoExists(content)).toBeTrue();
  });

  it('should return false if todo does not exist', () => {
    const content = 'unexisting todo';
    expect(todoService.todoExists(content)).toBeFalse();
  });

  it('should emit todos', (done) => {
    const content = 'todo to emit';
    todoService.addTodo(content);
    todoService.todoSubject.subscribe((todos: Todo[]) => {
      const numberOfTodos = 1;
      expect(todos.length).toBe(numberOfTodos);
      expect(todos[0].content).toBe(content);
      done();
    });
    todoService.emitTodos();
  });

  it('should toggle done state of a todo', () => {
    const content = 'toggle todo completion content';
    todoService.addTodo(content);

    const todo = todoService['_todos'][0];
    expect(todo.done).toBeFalse();

    todoService.toggleCompletedTodo(todo.id);
    expect(todo.done).toBeTrue();

    todoService.toggleCompletedTodo(todo.id);
    expect(todo.done).toBe(false);
  });

  it('should delete one todo', () => {
    const todo: Todo = {
      id: id(),
      content: 'todo to remove',
      createdAt: new Date(),
      done: false,
    };
    todoService['_todos'] = [todo];

    todoService.deleteOneTodo(todo.id);

    const numberOfTodoRemaining = 0;
    expect(todoService['_todos'].length).toEqual(numberOfTodoRemaining);
  });
});
