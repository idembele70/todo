import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo/todo.service';
import { TodoListComponent } from './todo-list.component';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    todoService = new TodoService();
    const activatedRouteMock = {
      url: of([{ path: 'active' }]),
    };

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: todoService },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call path subscribe on init', () => {
    spyOn(todoService, 'emitPath').and.callThrough();
    component.ngOnInit();
    expect(todoService.emitPath).toHaveBeenCalledOnceWith('active');
  });

  it('should call unsubscribe from pathSubscription on destroy', () => {
    const dummySub = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe']);
    (component as unknown as { pathSubscription: Subscription }).pathSubscription = dummySub;

    component.ngOnDestroy();

    expect(dummySub.unsubscribe).toHaveBeenCalled();
  });

  it('should render todos from the observable', () => {
    const todos: Todo[] = [
      {
        id: '12',
        content: 'Test todo',
        done: false,
        createdAt: new Date(),
      },
    ];
    const expectedTodoLength = todos.length;
    const expectedTodoContent = 'Test todo';

    todoService.todoSubject.next(todos);

    fixture.detectChanges();

    const todoElements = fixture.nativeElement.querySelectorAll('li');
    expect(todoElements.length).toBe(expectedTodoLength);
    expect(todoElements[0]?.textContent).toContain(expectedTodoContent);
  });

  xit('should call emitTodos on onDeleteOneTodo()', () => {
    component.onDeleteOneTodo();

    expect(todoService.emitTodos).toHaveBeenCalled();
  });
});
