import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Todo } from '@app/models/todo.model';
import { TodoService } from '@app/services/todo/todo.service';
import { BehaviorSubject, of } from 'rxjs';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let filteredTodos$: BehaviorSubject<Todo[]>;

  const PATH = 'all';
  const MOCK_TODOS: Todo[] = [
    {
      id: '1',
      content: 'random content',
      done: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      content: 'new content',
      done: true,
      createdAt: new Date(),
    },
  ];
  const TODOS_COUNT = MOCK_TODOS.length;

  beforeEach(async () => {
    const mockActivatedRoute: Partial<ActivatedRoute> = {
      url: of([{ path: PATH } as UrlSegment]),
    };

    filteredTodos$ = new BehaviorSubject(MOCK_TODOS);

    mockTodoService = jasmine.createSpyObj('todoService', ['emitPath', 'deleteAllCompletedTodos'], {
      filteredTodos$: filteredTodos$.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update itemCount based on filteredTodos$', () => {
    expect(component.itemCount).toEqual(TODOS_COUNT);
  });

  it('should filter todos based on path', () => {
    expect(mockTodoService.emitPath).toHaveBeenCalledWith(PATH);
  });

  it('should complete destroy$ observable', () => {
    const destroyNextSpy = spyOn(component.destroy$, 'next');
    const destroyCompleteSpy = spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(destroyNextSpy).toHaveBeenCalled();
    expect(destroyCompleteSpy).toHaveBeenCalled();
  });

  describe('empty todo', () => {
    beforeAll(() => {
      const emptyTodoService = jasmine.createSpyObj('todoService', ['emitPath'], { filteredTodos$: of([]) });

      TestBed.overrideProvider(TodoService, { useValue: emptyTodoService });
    });

    it('should set itemCount to 0 if filteredTodos$ is empty', () => {
      expect(component.itemCount).toBe(0);
    });
  });

  describe('onDeleteCompleteTodos()', () => {
    it('should delete completed todos and update todo count', () => {
      mockTodoService.deleteAllCompletedTodos.and.callFake(() => {
        const activeTodos = MOCK_TODOS.filter((t) => !t.done);
        filteredTodos$.next(activeTodos);
      });
      const clearCompletedEl = fixture.nativeElement.querySelector('.btn') as HTMLButtonElement;

      clearCompletedEl.click();
      fixture.detectChanges();

      expect(mockTodoService.deleteAllCompletedTodos).toHaveBeenCalled();
      expect(component.itemCount).toEqual(1);
      expect(component.hasCompletedTodo).toBeFalse();
    });
  });
});
