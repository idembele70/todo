import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Todo } from '@app/models/todo.model';
import { TodoService } from '@app/services/todo/todo.service';
import { of } from 'rxjs';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

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

    mockTodoService = jasmine.createSpyObj('todoService', ['emitPath'], { filteredTodos$: of(MOCK_TODOS) });

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
});
