import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo/todo.service';
import { AddTodoComponent } from './add-todo.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;

  let todoServiceMock: jasmine.SpyObj<TodoService>;

  let todoSubject: Subject<Todo[]>;
  let inputDe: DebugElement;

  beforeEach(async () => {
    todoSubject = new Subject<Todo[]>();

    todoServiceMock = jasmine.createSpyObj('todoService', ['addTodo', 'emitTodos', 'todoExists'], { todoSubject });
    await TestBed.configureTestingModule({
      imports: [AddTodoComponent],
      providers: [{ provide: TodoService, useValue: todoServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    todoServiceMock.emitTodos.calls.reset();

    inputDe = fixture.debugElement.query(By.css('input'));
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

    inputDe.triggerEventHandler('keydown.enter');
    fixture.detectChanges();

    expect(component.onAddTodo).toHaveBeenCalled();
  });

  it('should ensure onUpdateNewTodoText is triggered on user input', () => {
    spyOn(component, 'onUpdateNewTodoText');

    inputDe.triggerEventHandler('ngModelChange', 'todo text');
    fixture.detectChanges();

    expect(component.onUpdateNewTodoText).toHaveBeenCalled();
  });

  it('should update newTodoText via ngModel when user types', () => {
    const todoText = 'Buy milk';

    const inputEl = inputDe.nativeElement as HTMLInputElement;

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
});
