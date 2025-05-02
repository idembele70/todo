import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { v1 as id } from 'uuid';
import { Todo } from '../../models/todo';
import { TodoRowComponent } from './todo-row.component';
describe('TodoRowComponent', () => {
  let component: TodoRowComponent;
  let fixture: ComponentFixture<TodoRowComponent>;
  let toggleSpy: jasmine.Spy<(id: string) => boolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoRowComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.disableCheckbox = false;
    component.disableCloseBtn = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark a todo as done', fakeAsync(() => {
    toggleSpy = spyOn(component['todoService'], 'toggleCompletedTodo').and.callThrough();
    const todo: Todo = {
      id: id(),
      content: 'complete todo content',
      createdAt: new Date(),
      done: false
    };

    component.todo = todo;
    component['todoService']['_todos'] = [todo];

    component.onComplete();

    expect(component.disableCheckbox).toBeTrue();
    expect(component.disableCloseBtn).toBeTrue();

    tick(500);

    expect(component.disableCheckbox).toBeFalse();
    expect(component.disableCloseBtn).toBeFalse();
    expect(toggleSpy).toHaveBeenCalledWith(component.todo.id);
    expect(component.todo.done).toBeTrue();
    expect(component['todoService']['_todos'][0].done).toBeTrue();
  }));

  it('should unmark a completed todo', fakeAsync(() => {
    const todo: Todo = {
      id: id(),
      content: 'undone todo content',
      createdAt: new Date(),
      done: true
    };

    component.todo = todo;
    component['todoService']['_todos'] = [todo];

    component.onComplete();

    expect(component.disableCheckbox).toBeTrue();
    expect(component.disableCloseBtn).toBeTrue();

    tick(500);

    expect(component.disableCheckbox).toBeFalse();
    expect(component.disableCloseBtn).toBeFalse();
    expect(component.todo.done).toBeFalse();
    expect(component['todoService']['_todos'][0].done).toBeFalse();
    expect(toggleSpy).toHaveBeenCalledWith(component.todo.id);
  }));
});
