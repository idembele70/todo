import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    todoService = TestBed.inject(TodoService);
  });

  it('should add todo', () => {
    const count = todoService.todos.length
    const submitEvent = {preventDefault: () => {} } as SubmitEvent
    const content = "content for test xyz"
    todoService.addTodo(submitEvent, content)
    expect(todoService.todos.length).not.toEqual(count);
    expect(todoService.todos.find(todo => todo.content === content)).toBeTruthy()
  });

  it('should toggle todo state by id', () => {
    const todo = todoService.todos[0]
    const done = todo.done

    todoService.toggleDone(todo.id)

    expect(todo.done).not.toEqual(done)
  })

  it('should delete todo by id', () => {
    const count = todoService.addTodo.length
    const todo = todoService.todos[0]

    todoService.deleteTodo(todo.id)
    const numberOfDeleteTodos = 1
    expect(todoService.todos.length).toEqual(count - numberOfDeleteTodos)
  })
});
