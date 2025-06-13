import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo/todo.service';
import { AddTodoComponent } from './add-todo.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MOCK_TODOS } from '@app/services/todo/todo.service-mock';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app.routes';
import { completeAllTodos } from '@app/core/utils/todo.factory';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;

  let todoServiceMock: jasmine.SpyObj<TodoService>;

  let todoSubject: Subject<Todo[]>;
  let addTodoInputDe: DebugElement;
  let mockRouter: Partial<{
    url: string;
  }>;

  beforeEach(async () => {
    todoSubject = new Subject<Todo[]>();

    todoServiceMock = jasmine.createSpyObj(
      'todoService',
      ['addTodo', 'emitTodos', 'todoExists', 'completeAllActiveTodos'],
      { todoSubject },
    );
    mockRouter = {
      url: APP_ROUTES.HOME_ALL,
    };
    await TestBed.configureTestingModule({
      imports: [AddTodoComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceMock },
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    todoServiceMock.emitTodos.calls.reset();

    addTodoInputDe = fixture.debugElement.query(By.css('[data-testid="add-todo-input"]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call subscribe on init', () => {
    const spy = spyOn(todoServiceMock.todoSubject, 'subscribe').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call unsubscribe on destroy', () => {
    const spy = spyOn(component['todosSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable add button if todo exists', () => {
    todoServiceMock.todoExists.and.returnValue(true);
    component.onUpdateNewTodoText();

    expect(todoServiceMock.todoExists).toHaveBeenCalled();
    expect(component.isAddDisabled).toBeTrue();
  });

  /* onUpdateNewTodoText() Unit Test */

  it('should disable add if trimmed text is empty (only whitespace)', () => {
    const whiteSpaceText = '   ';
    component.newTodoText = whiteSpaceText;

    const trimmedText = whiteSpaceText.trim();
    todoServiceMock.todoExists.and.returnValue(false);

    component.onUpdateNewTodoText();

    expect(todoServiceMock.todoExists).toHaveBeenCalledWith(trimmedText);
    expect(component.disableAddBtn).toBeTrue();
  });

  it('should enable or disable add depending on todo existence', () => {
    const todoText = ' Buy car  ';

    component.newTodoText = todoText;
    todoServiceMock.todoExists.and.returnValue(true);
    const trimmedTodoText = todoText.trim();
    component.onUpdateNewTodoText();
    expect(todoServiceMock.todoExists).toHaveBeenCalledWith(trimmedTodoText);
    expect(component.disableAddBtn).toBeTrue();

    todoServiceMock.todoExists.and.returnValue(false);
    component.onUpdateNewTodoText();
    expect(todoServiceMock.todoExists).toHaveBeenCalledWith(trimmedTodoText);
    expect(component.disableAddBtn).toBeFalse();
  });

  it('should disable add if todo text is valid but already exists', () => {
    const validTodoText = 'valid todo text';
    component.newTodoText = validTodoText;

    todoServiceMock.todoExists.and.returnValue(true);

    component.onUpdateNewTodoText();

    expect(todoServiceMock.todoExists).toHaveBeenCalled();
    expect(component.disableAddBtn).toBeTrue();
  });

  /* isAddDisabled() */

  it('should return true for isDisabled when disabledAddBtn is true', () => {
    component.disableAddBtn = true;

    expect(component.isAddDisabled).toBeTrue();
  });

  it('should return true for isDisabled when disabled newTodoText is only whitespace', () => {
    component.newTodoText = '   ';

    expect(component.isAddDisabled).toBeTrue();
  });

  it('should return false for isDisabled when all conditions are fine', () => {
    component.newTodoText = 'Valid todo';
    component.disableAddBtn = false;

    expect(component.isAddDisabled).toBeFalse();
  });

  /* onAddTodo() Unit Tests */

  it('should add trimmed todo, reset input, emit todos, and toggle input state flags', () => {
    component.disableAddBtn = false;
    const todoText = '  Buy car  ';
    const trimmedTodoText = todoText.trim();
    component.newTodoText = todoText;

    component.onAddTodo();

    expect(todoServiceMock.addTodo).toHaveBeenCalledWith(trimmedTodoText);
    expect(component.newTodoText).toBe('');
    expect(todoServiceMock.emitTodos).toHaveBeenCalled();
    expect(component.disableAddInput).toBeFalse();
    expect(component.disableAddBtn).toBeFalse();
  });

  it('should do nothing if newTodoText is only whitespace', () => {
    component.newTodoText = '   ';
    component.onUpdateNewTodoText();
    component.onAddTodo();

    expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
    expect(component.newTodoText).not.toEqual('');
    expect(todoServiceMock.emitTodos).not.toHaveBeenCalled();
    expect(component.isAddDisabled).toBeTrue();
    expect(component.disableAddInput).toBeFalse();
  });

  it('should do nothing if disabledAddBtn is true', () => {
    component.disableAddBtn = true;
    component.newTodoText = 'Buy eggs';

    component.onAddTodo();

    expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
    expect(component.newTodoText).not.toBe('');
    expect(todoServiceMock.emitTodos).not.toHaveBeenCalled();
    expect(component.isAddDisabled).toBeTrue();
    expect(component.disableAddInput).toBeFalse();
  });

  /* Input Unit Tests */

  it('should call onAddTodo when Enter key is pressed in input', () => {
    spyOn(component, 'onAddTodo');

    addTodoInputDe.triggerEventHandler('keydown.enter');
    fixture.detectChanges();

    expect(component.onAddTodo).toHaveBeenCalled();
  });

  it('should ensure onUpdateNewTodoText is triggered on user input', () => {
    spyOn(component, 'onUpdateNewTodoText');

    addTodoInputDe.triggerEventHandler('ngModelChange', 'todo text');
    fixture.detectChanges();

    expect(component.onUpdateNewTodoText).toHaveBeenCalled();
  });

  it('should update newTodoText via ngModel when user types', () => {
    const todoText = 'Buy milk';

    const inputEl = addTodoInputDe.nativeElement as HTMLInputElement;

    inputEl.value = todoText;

    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.newTodoText).toEqual(todoText);
  });

  /* Add button Unit Tests */

  it('should call onAddTodo when Add button is clicked', () => {
    const buttonDe = fixture.debugElement.query(By.css('button'));
    spyOn(component, 'onAddTodo');

    buttonDe.triggerEventHandler('click');
    fixture.detectChanges();

    expect(component.onAddTodo).toHaveBeenCalled();
  });

  /* Add unit test for mark all active todos as complete */
  describe('completeAllActiveTodos', () => {
    let event: MouseEvent;

    beforeEach(() => {
      event = new MouseEvent('click');

      todoServiceMock.todoSubject.next(MOCK_TODOS);

      todoServiceMock.completeAllActiveTodos.and.callFake(() => {
        completeAllTodos(MOCK_TODOS);
      });
    });

    it('should complete active todos', () => {
      component.onCompleteAllActiveTodos(event);

      expect(todoServiceMock.completeAllActiveTodos).toHaveBeenCalledTimes(1);

      const hasActiveTodos = component.todos.some((t) => t.done === false);
      expect(hasActiveTodos).toBeFalse();
    });

    it('should prevent default in active todos view', () => {
      mockRouter.url = APP_ROUTES.HOME_ACTIVE;

      spyOn(event, 'preventDefault');

      component.onCompleteAllActiveTodos(event);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  describe('isChecked', () => {
    it('should return true if all todos page, no active todos & at least one todo exists', () => {
      completeAllTodos(MOCK_TODOS);
      component.todos = MOCK_TODOS;
      expect(mockRouter.url).toBe(APP_ROUTES.HOME_ALL);
      expect(component.hasNoActiveTodos).toBeTrue();
      expect(!!component.todos.length).toBeGreaterThan(0);

      expect(component.isChecked).toBeTrue();
    });

    it('should return false if at least one todo is active', () => {
      const partialTodos = [...MOCK_TODOS];
      partialTodos[0].done = false;
      component.todos = partialTodos;

      expect(component.isChecked).toBeFalse();
    });
  });

  describe('isCheckboxDisabled', () => {
    beforeEach(() => {
      component.todos = MOCK_TODOS;
    });
    it('should disabled checkbox if completed todos view & no active todos', () => {
      completeAllTodos(MOCK_TODOS);

      mockRouter.url = APP_ROUTES.HOME_COMPLETED;

      expect(component.isCheckboxDisabled).toBeTrue();
    });

    it('should not disabled on all todos page', () => {
      expect(component.isCheckboxDisabled).toBeTrue();
    });
  });
});
