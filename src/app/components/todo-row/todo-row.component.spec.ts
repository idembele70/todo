import { ElementRef, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Tooltip } from 'bootstrap';
import { TodoService } from '../../services/todo/todo.service';
import { TodoRowComponent } from './todo-row.component';

describe('TodoRowComponent', () => {
  let component: TodoRowComponent;
  let fixture: ComponentFixture<TodoRowComponent>;
  let todoService: TodoService;

  const MOCK_CONTENT = 'the content mocked';
  const DELAY_MS = 100;
  const EXPECTED_CALL_COUNT = 1;

  const createFakeLiElement = () => new ElementRef(document.createElement('li'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoRowComponent],
    }).compileComponents();

    todoService = TestBed.inject(TodoService);
    spyOn(todoService, 'toggleCompletedTodo').and.callThrough();
    spyOn(todoService, 'emitTodos').and.callThrough();
    spyOn(todoService, 'deleteOneTodo').and.callThrough();
    spyOn(todoService, 'editContent').and.callThrough();

    fixture = TestBed.createComponent(TodoRowComponent);
    component = fixture.componentInstance;

    todoService.addTodo(MOCK_CONTENT);
    component.todo = todoService.todoSubject.value[0];

    spyOn(component, 'destroyTooltip').and.callThrough();
    spyOn(component, 'performDeletion').and.callThrough();
    spyOn(component, 'createTooltip').and.callThrough();

    component.todoRowRef = createFakeLiElement();
    component.disableCheckbox = false;
    component.disableCloseBtn = false;

    fixture.detectChanges();
  });

  function setupEditMode(content = component.todo.content) {
    component.onEnterEditMode();
    component.editInputFormControl.setValue(content);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnComplete()', () => {
    it('should mark a todo as done', fakeAsync(() => {
      component.onComplete();

      expect(component.disableCheckbox).toBeTrue();
      expect(component.disableCloseBtn).toBeTrue();

      tick(DELAY_MS);

      expect(component.disableCheckbox).toBeFalse();
      expect(component.disableCloseBtn).toBeFalse();
      expect(todoService.toggleCompletedTodo).toHaveBeenCalledOnceWith(component.todo.id);
      expect(component.todo.done).toBeTrue();
    }));

    it('should unmark a completed todo', fakeAsync(() => {
      component.todo.done = true;

      component.onComplete();

      tick(DELAY_MS);

      expect(todoService.toggleCompletedTodo).toHaveBeenCalledWith(component.todo.id);
      expect(component.todo.done).toBeFalse();
    }));
  });

  describe('performDeletion()', () => {
    it('should delete the todo and emit event', () => {
      const deleteTodoEmitterSpy: jasmine.SpyObj<EventEmitter<unknown>> = jasmine.createSpyObj<EventEmitter<unknown>>(
        'deleteTodo',
        ['emit'],
      );
      component.deleteTodo = deleteTodoEmitterSpy;

      component.performDeletion();

      expect(todoService.deleteOneTodo).toHaveBeenCalledWith(component.todo.id);
      expect(deleteTodoEmitterSpy.emit).toHaveBeenCalled();
    });
  });

  describe('onDelete()', () => {
    it('should handle delete UI state and call deletion', fakeAsync(() => {
      component.onDelete();

      expect(component.disableCheckbox).toBeTrue();
      expect(component.disableCloseBtn).toBeTrue();

      tick(DELAY_MS);

      expect(component.destroyTooltip).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
      expect(component.performDeletion).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
      expect(component.disableCheckbox).toBeFalse();
      expect(component.disableCloseBtn).toBeFalse();
    }));
  });

  describe('onEnterEditMode()', () => {
    it('should delete todo when saving empty content', () => {
      const setValueSpy = spyOn(component.editInputFormControl, 'setValue').and.callThrough();

      component.onEnterEditMode();

      expect(component.isEditing).toBeTrue();
      expect(component.currentContent).toBe(component.todo.content);
      expect(setValueSpy).toHaveBeenCalledOnceWith(component.todo.content);
      expect(component.editInputFormControl.value).toEqual(component.todo.content);
      expect(component.destroyTooltip).toHaveBeenCalled();
    });
  });

  describe('onSave()', () => {
    it('should delete todo when saving empty content', () => {
      setupEditMode('   ');

      component.onSave();

      expect(component.performDeletion).toHaveBeenCalledTimes(EXPECTED_CALL_COUNT);
      expect(component.isEditing).toBeFalse();
      expect(component.hasFocusedInput).toBeFalse();
    });

    it('should update todo content when saving valid input', () => {
      const newContent = 'Updated content';
      setupEditMode(newContent);

      component.onSave();

      expect(todoService.editContent).toHaveBeenCalledWith(component.todo.id, newContent);
      expect(component.createTooltip).toHaveBeenCalled();
      expect(component.isEditing).toBeFalse();
      expect(component.hasFocusedInput).toBeFalse();
    });
  });

  describe('ngAfterViewChecked()', () => {
    it('should focus on input when editing', () => {
      const focusSpy = jasmine.createSpy('focus');
      component.inputRef = {
        nativeElement: {
          focus: focusSpy,
        },
      };
      component.isEditing = true;

      component.ngAfterViewChecked();

      expect(focusSpy).toHaveBeenCalled();
      expect(component.hasFocusedInput).toBeTrue();
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should initialize tooltip', () => {
      component.todoRowRef = createFakeLiElement();

      component.ngAfterViewInit();

      expect(component.createTooltip).toHaveBeenCalled();
    });
  });

  describe('createTooltip()', () => {
    it('should create tooltip', () => {
      component.todoRowRef = createFakeLiElement();

      component.createTooltip();

      expect(component.tooltipInstance).toBeTruthy();
    });
  });

  describe('destroyTooltip()', () => {
    it('should destroy a tooltip', () => {
      const tooltipSpyObj = jasmine.createSpyObj<Tooltip>('Tooltip', ['dispose']);
      component.tooltipInstance = tooltipSpyObj;

      component.destroyTooltip();

      expect(tooltipSpyObj.dispose).toHaveBeenCalled();
    });
  });
});
