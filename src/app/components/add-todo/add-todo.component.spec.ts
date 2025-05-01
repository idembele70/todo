import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo/todo.service';
import { AddTodoComponent } from './add-todo.component';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let todoServiceMock: jasmine.SpyObj<TodoService>;
  let todoSubject: Subject<Todo[]>;

  beforeEach(async () => {
    todoSubject = new Subject<Todo[]>();
    todoServiceMock = jasmine.createSpyObj('todoService', ['addTodo', 'emitTodos', 'todoExists'], { todoSubject })
    await TestBed.configureTestingModule({
      imports: [AddTodoComponent],
      providers: [{ provide: TodoService, useValue: todoServiceMock }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    component.newTodoText = 'Exisiting'
    todoServiceMock.todoExists.and.returnValue(true);
    component.onUpdateNewTodoText();
    expect(component.disableAddBtn).toBeTrue();
  });

  it('should enable add button if todo no longer exists', () => {
    component.disableAddBtn = true;
    component.newTodoText = 'New';
    todoServiceMock.todoExists.and.returnValue(false);
    component.onUpdateNewTodoText();
    expect(component.disableAddBtn).toBeFalse();
  });

  it('should add todo and reset states', () => {
    component.newTodoText = 'Do this';
    component.disableAddBtn = false;
    component.disableAddInput = false;

    component.onAddTodo();

    expect(component.newTodoText).toBe('');
    expect(todoServiceMock.emitTodos).toHaveBeenCalled();
    expect(component.disableAddInput).toBeFalse();
    expect(component.disableAddBtn).toBeFalse();
  })
});
