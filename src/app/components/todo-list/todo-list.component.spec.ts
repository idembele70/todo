import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo/todo.service';
import { Subject } from 'rxjs';
import { Todo } from '../../models/todo.model.';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoSubject: Subject<Todo[]>;
  let todoServiceMock: jasmine.SpyObj<TodoService>;
  beforeEach(async () => {
    todoSubject = new Subject<Todo[]>();
    todoServiceMock = jasmine.createSpyObj('todoService', ['emitTodos'], { todoSubject });
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: todoServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call subscribe on init', () => {
    const subscribeSpy = spyOn(todoServiceMock.todoSubject, 'subscribe').and.callThrough();

    component.ngOnInit();

    expect(subscribeSpy).toHaveBeenCalled();
  });

  it('should call unsubscribe from todoSubscription on detroy', () => {
    const unsubscribeSpy = spyOn(component.todosSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should call emitTodos on onDeleteOneTodo()', () => {
    component.onDeleteOneTodo();

    expect(todoServiceMock.emitTodos).toHaveBeenCalled();
  });
});
