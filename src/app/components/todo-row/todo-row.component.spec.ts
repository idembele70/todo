import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TodoService } from '../../services/todo/todo.service';
import { MOCK_TODOS, TodoServiceMock } from '../../services/todo/todo.service-mock';
import { TodoRowComponent } from './todo-row.component';
describe('TodoRowComponent', () => {
  let component: TodoRowComponent;
  let fixture: ComponentFixture<TodoRowComponent>;
  let todoServiceMock: TodoServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoRowComponent],
      providers: [{ provide: TodoService, useClass: TodoServiceMock }],
    }).compileComponents();

    todoServiceMock = TestBed.inject(TodoService) as TodoServiceMock;
    spyOn(todoServiceMock, 'toggleCompletedTodo').and.callThrough();
    spyOn(todoServiceMock, 'emitTodos').and.callThrough();
    spyOn(todoServiceMock, 'deleteOneTodo').and.callThrough();

    fixture = TestBed.createComponent(TodoRowComponent);
    component = fixture.componentInstance;

    component.disableCheckbox = false;
    component.disableCloseBtn = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark a todo as done', fakeAsync(() => {
    component.todo = MOCK_TODOS[0];
    component.onComplete();

    expect(component.disableCheckbox).toBeTrue();
    expect(component.disableCloseBtn).toBeTrue();

    tick(100);

    expect(component.disableCheckbox).toBeFalse();
    expect(component.disableCloseBtn).toBeFalse();
    expect(todoServiceMock.toggleCompletedTodo).toHaveBeenCalledOnceWith(component.todo.id);
    expect(todoServiceMock.emitTodos).toHaveBeenCalled();

    const updatedTodo = todoServiceMock.getOneTodo(component.todo.id);
    expect(updatedTodo.done).toBeTrue();
  }));

  it('should unmark a completed todo', fakeAsync(() => {
    component.todo = MOCK_TODOS[1];
    component.onComplete();

    expect(component.disableCheckbox).toBeTrue();
    expect(component.disableCloseBtn).toBeTrue();

    tick(100);

    expect(component.disableCheckbox).toBeFalse();
    expect(component.disableCloseBtn).toBeFalse();
    expect(todoServiceMock.toggleCompletedTodo).toHaveBeenCalledWith(component.todo.id);
    const updatedTodo = todoServiceMock.getOneTodo(component.todo.id);
    expect(updatedTodo.done).toBeFalse();
  }));

  xit('should delete one todo', fakeAsync(() => {
    component.todo = MOCK_TODOS[1];

    component.onDelete();

    expect(component.disableCheckbox).toBeTrue();
    expect(component.disableCloseBtn).toBeTrue();

    tick(100);

    expect(component.disableCheckbox).toBeFalse();
    expect(component.disableCloseBtn).toBeFalse();

    expect(todoServiceMock.deleteOneTodo).toHaveBeenCalledWith(component.todo.id);
    expect(todoServiceMock.emitTodos()).toHaveBeenCalled();
  }));

  it('should enter edit mode', () => {
    component.todo = MOCK_TODOS[0];
    spyOn(component, 'destroyTooltip');

    component.onEnterEditMode();

    expect(component.isEditing).toBeTrue();
    expect(component.currentContent).toEqual(component.todo.content);
    expect(component.editInputFormControl.value).toEqual(component.todo.content);
    expect(component.destroyTooltip).toHaveBeenCalled();
  });
});
