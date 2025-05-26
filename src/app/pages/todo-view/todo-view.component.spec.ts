import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router } from '@angular/router';
import { of } from 'rxjs';
import { APP_ROUTES } from '../../core/constants/app.routes';
import { createRandomTodo } from '../../core/utils/todo.factory';
import { TodoService } from '../../services/todo/todo.service';
import { TodoViewComponent } from './todo-view.component';
import { fakerFR } from '@faker-js/faker';

describe('TodoViewComponent', () => {
  let component: TodoViewComponent;
  let fixture: ComponentFixture<TodoViewComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let mockParams: Params;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;

  const MOCK_TODO = createRandomTodo();

  beforeEach(async () => {
    mockParams = { id: MOCK_TODO.id + 'dd' };
    mockActivatedRoute = {
      snapshot: {
        params: mockParams,
      } as ActivatedRouteSnapshot,
    };

    mockRouter = jasmine.createSpyObj('router', ['navigate']);

    mockActivatedRoute.snapshot!.params['id'] = MOCK_TODO.id;

    mockTodoService = jasmine.createSpyObj('todoService', [
      'getOneTodo',
      'deleteOneTodo',
      'editContent',
      'toggleCompletedTodo',
      'deleteOneTodo',
    ]);

    await TestBed.configureTestingModule({
      imports: [TodoViewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compileComponents();

    mockTodoService.getOneTodo.and.returnValue(of(MOCK_TODO));

    fixture = TestBed.createComponent(TodoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.todo.id = MOCK_TODO.id;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should display load a specific todo', () => {
      component.ngOnInit();

      expect(component.todo).toEqual(MOCK_TODO);
    });

    it(` should navigate to ${APP_ROUTES.HOME_ALL} if todo not found`, () => {
      const id = MOCK_TODO.id + '_invalid';
      mockActivatedRoute.snapshot!.params = { id };
      mockTodoService.getOneTodo.and.returnValue(of(undefined));

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith([APP_ROUTES.HOME_ALL]);
    });
  });

  describe('ngOnDestroy()', () => {
    it('should unsubscribe from todoSubscription', () => {
      const unsubscribeSpy = spyOn(component.todoSubscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('isDone()', () => {
    it('should return true if todo is done', () => {
      component.todo.done = true;
      expect(component.isDone).toBeTrue();
    });
    it('should return false if todo is not done', () => {
      component.todo.done = false;
      expect(component.isDone).toBeFalse();
    });
  });

  describe('completeButtonLabel()', () => {
    const testCases = [
      { done: true, expectedLabel: 'Incomplete' },
      { done: false, expectedLabel: 'Complete' },
    ];
    testCases.forEach(({ done, expectedLabel }) => {
      it(`should return '${expectedLabel}' when done is ${done}`, () => {
        component.todo.done = done;
        expect(component.completeButtonLabel).toEqual(expectedLabel);
      });
    });
  });

  describe('lastUpdateLabel()', () => {
    it('It should return a valid Date if updatedAt is defined', () => {
      component.todo.updatedAt = Date.now();

      expect(component.lastUpdateLabel).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}, \d{1,2}:\d{2}:\d{2} [AP]M$/);
    });
    it('It should return "Never updated" if updatedAt is undefined', () => {
      component.todo.updatedAt = undefined;
      const expectedLabel = 'Never updated';
      expect(component.lastUpdateLabel).toBe(expectedLabel);
    });
  });

  describe('onSave()', () => {
    let onDeleteSpy: jasmine.Spy;

    beforeEach(() => {
      onDeleteSpy = spyOn(component, 'onDelete');
    });
    it('should delete todo if content is empty', () => {
      const emptyText = '';
      component.todo.content = emptyText;

      component.onSave();

      expect(onDeleteSpy).toHaveBeenCalled();
    });

    it('should edit content with the new text', () => {
      const updatedContent = fakerFR.lorem.sentence(2);
      component.todo.content = updatedContent;

      component.onSave();

      expect(component.todo.content).toEqual(updatedContent);
      expect(mockTodoService.editContent).toHaveBeenCalledOnceWith(component.todo.id, updatedContent);
    });
  });

  describe('onToggleComplete()', () => {
    const callToggleWith = (initialDone: boolean, expectedDone: boolean) => {
      mockTodoService.toggleCompletedTodo.and.callFake((id) => {
        if (component.todo.id === id) component.todo.done = !component.todo.done;
      });

      component.todo.done = initialDone;
      component.onToggleComplete();

      expect(component.todo.done).toBe(expectedDone);
      expect(mockTodoService.toggleCompletedTodo).toHaveBeenCalledOnceWith(component.todo.id);
    };

    it('should complete todo', () => {
      callToggleWith(false, true);
    });
    it('should uncomplete todo', () => {
      callToggleWith(true, false);
    });
  });

  describe('onDelete()', () => {
    it(`should delete the todo and navigate to ${APP_ROUTES.HOME_ALL}`, () => {
      component.onDelete();

      expect(mockTodoService.deleteOneTodo).toHaveBeenCalledOnceWith(component.todo.id);
      expect(mockRouter.navigate).toHaveBeenCalledWith([APP_ROUTES.HOME_ALL]);
    });
  });
});
