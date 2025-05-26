import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo/todo.service';
import { TodoListComponent } from './todo-list.component';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: TodoService;
  let mockRoute: Partial<ActivatedRoute>;
  let completedTodo: Todo;
  let activeTodo: Todo;

  const MOCK_CONTENT = ['First content', 'Second content'];

  beforeEach(async () => {
    mockRoute = {
      url: of([{ path: 'active' } as UrlSegment]),
    };

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockRoute,
        },
      ],
    }).compileComponents();

    todoService = TestBed.inject(TodoService);
    spyOn(todoService, 'emitPath').and.callThrough();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;

    todoService.addTodo(MOCK_CONTENT[0]);
    const todoToCompleteId = todoService.todoSubject.value[0].id;
    todoService.toggleCompletedTodo(todoToCompleteId);
    completedTodo = todoService.todoSubject.value[0];

    todoService.addTodo(MOCK_CONTENT[1]);
    activeTodo = todoService.todoSubject.value[1];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('todos$', () => {
    it('should return all todos for path "all"', (done) => {
      mockRoute.url = of([{ path: 'all' } as UrlSegment]);
      component.ngOnInit();

      component.todos$.subscribe((todos) => {
        const todosLength = todos.length;
        const expectedLength = MOCK_CONTENT.length;

        expect(todosLength).toEqual(expectedLength);
        expect(todos).toEqual([completedTodo, activeTodo]);

        done();
      });
    });

    it('should return only active todo for path "active"', (done) => {
      mockRoute.url = of([{ path: 'active' } as UrlSegment]);
      component.ngOnInit();

      component.todos$.subscribe((todos) => {
        const todosLength = todos.length;
        const expectedLength = 1;

        expect(todosLength).toBe(expectedLength);
        expect(todos).toContain(activeTodo);

        done();
      });
    });

    it('should return completed todo for path "completed"', (done) => {
      mockRoute.url = of([{ path: 'completed' } as UrlSegment]);
      component.ngOnInit();

      component.todos$.subscribe((todos) => {
        const todosLength = todos.length;
        const expectedLength = 1;

        expect(todosLength).toBe(expectedLength);
        expect(todos).toContain(completedTodo);

        done();
      });
    });
  });

  describe('ngOnInit()', () => {
    it('should call emitPath on init', () => {
      component.ngOnInit();
      expect(todoService.emitPath).toHaveBeenCalledWith('active');
    });

    it('should emit "all" when no path is provided', () => {
      mockRoute.url = of([]);

      component.ngOnInit();
      expect(todoService.emitPath).toHaveBeenCalledWith('all');
    });
  });

  describe('ngOnDestroy()', () => {
    it('should call unsubscribe from pathSubscription on destroy', () => {
      spyOn(component.pathSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(component.pathSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('app-todo-row', () => {
    it('should render todos from the observable', () => {
      mockRoute.url = of([{ path: 'all' } as UrlSegment]);

      component.ngOnInit();

      const expectedLength = MOCK_CONTENT.length;

      fixture.detectChanges();

      const todoElements = fixture.nativeElement.querySelectorAll('li');
      expect(todoElements.length).toBe(expectedLength);
      expect(todoElements[0]?.textContent).toContain(completedTodo.content);
    });
  });

  xit('should call emitTodos on onDeleteOneTodo()', () => {
    component.onDeleteOneTodo();

    expect(todoService.emitTodos).toHaveBeenCalled();
  });
});
