import { TestBed } from '@angular/core/testing';
import { Todo } from '../../models/todo.model';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  let allTodos: Todo[];
  let emitTodosSpy: jasmine.Spy;

  const MOCK_CONTENTS = ['content one', 'second content'];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    todoService = TestBed.inject(TodoService);

    todoService.addTodo(MOCK_CONTENTS[0]);
    const completedTodo = todoService.todoSubject.value[0];
    todoService.toggleCompletedTodo(completedTodo.id);

    todoService.addTodo(MOCK_CONTENTS[1]);

    allTodos = todoService.todoSubject.value;

    emitTodosSpy = spyOn(todoService, 'emitTodos').and.callThrough();
    spyOn(todoService, 'updateTodoTimestamp').and.callThrough();
  });

  it('should be created', () => {
    expect(todoService).toBeTruthy();
  });

  describe('todoSubject', () => {
    it('should return all the todos', () => {
      todoService.todoSubject.subscribe((todos) => {
        expect(todos).toEqual(allTodos);
      });
    });
  });

  describe('filteredTodos$', () => {
    it('should return all todos when path is "all"', () => {
      const allTodos = todoService.todoSubject.value;

      todoService.filteredTodos$.subscribe((todos) => {
        expect(todos).toEqual(allTodos);
      });
    });

    it('should return active todos when path is "active"', () => {
      todoService.emitPath('active');

      const allTodos = todoService.todoSubject.value;

      todoService.filteredTodos$.subscribe((todos) => {
        expect(todos).not.toEqual(allTodos);

        const todosLength = todos.length;
        const expectedLength = 1;
        expect(todosLength).toEqual(expectedLength);
      });
    });

    it('should return active todos when path is "completed"', () => {
      todoService.emitPath('completed');

      const completedTodos = todoService.todoSubject.value.filter((todo) => todo.done);

      todoService.filteredTodos$.subscribe((todos) => {
        expect(todos).toEqual(completedTodos);
      });
    });
  });

  describe('emitTodos()', () => {
    it('should emit todos', () => {
      const content = 'todo to emit';
      todoService.addTodo(content);

      spyOn(todoService.todoSubject, 'next');

      todoService.emitTodos();

      const todos = todoService.todoSubject.value;

      expect(todoService.todoSubject.next).toHaveBeenCalledWith(todos);
    });
  });

  describe('addTodo()', () => {
    it('should add todo', () => {
      const content = 'Test todo';
      todoService.addTodo(content);

      const todos = todoService.todoSubject.value;
      const todosLength = todos.length;
      const expectedLength = MOCK_CONTENTS.length + 1;

      expect(todosLength).toBe(expectedLength);
      expect(todoService.emitTodos).toHaveBeenCalled();
    });
  });

  describe('todoExists()', () => {
    it('should return true if todo exists', () => {
      const content = MOCK_CONTENTS[0];
      expect(todoService.todoExists(content)).toBeTrue();
    });

    it('should return false if todo does not exist', () => {
      const content = 'unexisting todo';
      expect(todoService.todoExists(content)).toBeFalse();
    });
  });

  describe('toggleCompletedTodo()', () => {
    it('should toggle done state of a todo', () => {
      const originalTodo = todoService.todoSubject.value[1];
      expect(originalTodo.done).toBeFalse();

      todoService.toggleCompletedTodo(originalTodo.id);
      const updatedTodo1 = todoService.todoSubject.value[1];
      expect(updatedTodo1.done).toBeTrue();
      expect(todoService.emitTodos).toHaveBeenCalled();

      todoService.toggleCompletedTodo(originalTodo.id);
      const updatedTodo2 = todoService.todoSubject.value[1];
      expect(updatedTodo2.done).toBe(false);
      expect(todoService.emitTodos).toHaveBeenCalled();

      const expectedUpdateTodoTimestampCall = 2;
      expect(todoService.updateTodoTimestamp).toHaveBeenCalledTimes(expectedUpdateTodoTimestampCall);
    });
  });

  describe('deleteOneTodo()', () => {
    it('should delete one todo', () => {
      const todos = todoService.todoSubject.value;
      const todo = todos[1];

      todoService.deleteOneTodo(todo.id);

      const numberOfTodosRemaining = todoService.todoSubject.value.length;

      const expectedLength = 1;
      expect(numberOfTodosRemaining).toEqual(expectedLength);
      expect(todoService.emitTodos).toHaveBeenCalled();
    });
  });

  describe('deleteAllCompletedTodo()', () => {
    it('should remove all todos with done = true', () => {
      todoService.deleteAllCompletedTodos();

      const todoCount = todoService.todoSubject.value.length;

      expect(todoCount).toEqual(1);
    });
  });

  describe('editContent()', () => {
    it('should edit a todo content', () => {
      const newContent = 'edited content';
      const todo = todoService.todoSubject.value[0];

      todoService.editContent(todo.id, newContent);

      expect(todo.content).toEqual(newContent);
      expect(todoService.emitTodos).toHaveBeenCalled();
      expect(todoService.updateTodoTimestamp).toHaveBeenCalled();
    });
  });

  describe('getOneTodo()', () => {
    it('should retrieve one todo via its ID', (done) => {
      const expectedTodo = todoService.todoSubject.value[0];

      todoService.getOneTodo(expectedTodo.id).subscribe((todo) => {
        expect(todo).toEqual(expectedTodo);
        done();
      });
    });
  });

  describe('updateTodoTimestamp()', () => {
    it('should update todo timestamp', () => {
      const originalTodo = todoService.todoSubject.value[0];

      todoService.updateTodoTimestamp(originalTodo.id);

      const updatedTodo = todoService.todoSubject.value[0];

      expect(updatedTodo.updatedAt).not.toBeUndefined();
    });
  });

  describe('completeAllActiveTodos()', () => {
    it('should complete all active todos and emit', () => {
      todoService.completeAllActiveTodos();

      const previouslyActiveTodo = todoService.todoSubject.value[1];

      expect(previouslyActiveTodo.done).toBeTrue();
      expect(previouslyActiveTodo.updatedAt).toBeDefined();
      expect(emitTodosSpy).toHaveBeenCalled();
    });

    it('should not emit todos if all todos are already completed', () => {
      const uncompletedTodoId = todoService.todoSubject.value[1].id;
      todoService.toggleCompletedTodo(uncompletedTodoId);

      emitTodosSpy.calls.reset();

      todoService.completeAllActiveTodos();

      expect(emitTodosSpy).not.toHaveBeenCalled();
    });
  });
});
