import { Location } from '@angular/common';
import { DebugElement, ElementRef, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { Tooltip } from 'bootstrap';
import { routes } from '../../app.routes';
import { TodoService } from '../../services/todo/todo.service';
import { TodoRowComponent } from './todo-row.component';
import { BOOTSTRAP_CSS_CLASSES } from '../../core/constants/bootstrap-css-classes.enum';

describe('TodoRowComponent', () => {
  let component: TodoRowComponent;
  let fixture: ComponentFixture<TodoRowComponent>;
  let todoService: TodoService;
  let router: Router;
  let destroyTooltipSpy: jasmine.Spy;

  const MOCK_CONTENT = 'the content mocked';
  const ON_COMPLETE_DELAY_MS = 100;
  const EXPECTED_CALL_COUNT = 1;
  const DOUBLE_CLICK_DELAY_MS = 250;
  const TODO_PAGE_PATH = '/todo';
  const DELAY_BETWEEN_EACH_CLICK_MS = 100;

  const createFakeLiElement = () => new ElementRef(document.createElement('li'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoRowComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    todoService = TestBed.inject(TodoService);
    spyOn(todoService, 'toggleCompletedTodo').and.callFake((id) => {
      if (component.todo.id === id) component.todo.done = !component.todo.done;
    });
    spyOn(todoService, 'emitTodos').and.callThrough();
    spyOn(todoService, 'deleteOneTodo').and.callThrough();
    spyOn(todoService, 'editContent').and.callThrough();

    router = TestBed.inject(Router);

    spyOn(window, 'clearTimeout').and.callThrough();

    fixture = TestBed.createComponent(TodoRowComponent);
    component = fixture.componentInstance;

    todoService.addTodo(MOCK_CONTENT);
    component.todo = todoService.todoSubject.value[0];

    destroyTooltipSpy = spyOn(component, 'destroyTooltip').and.callThrough();
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

  describe('Unit Tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('OnComplete()', () => {
      it('should mark a todo as done', fakeAsync(() => {
        component.onComplete();

        expect(component.disableCheckbox).toBeTrue();
        expect(component.disableCloseBtn).toBeTrue();

        tick(ON_COMPLETE_DELAY_MS);

        expect(component.disableCheckbox).toBeFalse();
        expect(component.disableCloseBtn).toBeFalse();
        expect(todoService.toggleCompletedTodo).toHaveBeenCalledOnceWith(component.todo.id);
        expect(component.todo.done).toBeTrue();
      }));

      it('should unmark a completed todo', fakeAsync(() => {
        component.todo.done = true;

        component.onComplete();

        tick(ON_COMPLETE_DELAY_MS);

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

        tick(ON_COMPLETE_DELAY_MS);

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

        expect(clearTimeout).toHaveBeenCalledWith(component.clickCount);
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

    describe('onClick()', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
      });

      it('should trigger a single click and navigate after delay', fakeAsync(() => {
        destroyTooltipSpy.calls.reset();

        component.onClick();
        tick(DOUBLE_CLICK_DELAY_MS);

        const expectedSingleClickCount = 0;
        expect(component.clickCount).toEqual(expectedSingleClickCount);
        expect(component.destroyTooltip).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledOnceWith([TODO_PAGE_PATH, component.todo.id]);
      }));

      it('should trigger double click and enter edit mode', fakeAsync(() => {
        spyOn(component, 'onEnterEditMode').and.callThrough();

        component.onClick();
        const expectedClickTimer = component.clickTimer;

        tick(DELAY_BETWEEN_EACH_CLICK_MS);
        component.onClick();

        expect(clearTimeout).toHaveBeenCalledWith(expectedClickTimer);
        const expectedClickCount = 0;
        expect(component.clickCount).toEqual(expectedClickCount);
        expect(component.onEnterEditMode).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      }));
    });
  });

  describe('Integration Tests', () => {
    let todoInfoWrapperEl: HTMLDivElement;
    let todoContentDe: DebugElement;
    let todoContentEl: HTMLLabelElement;
    let editContentInputDe: DebugElement;
    let editContentInputEl: HTMLInputElement;
    let todoRowContainerEl: HTMLLIElement;

    const CSS_SELECTORS = {
      EDIT_CONTENT_INPUT: '.edit-mode-input',
      TODO_ROW_CONTAINER: '.todo-row',
    };

    beforeEach(() => {
      todoContentDe = fixture.debugElement.query(By.css('label'));
      todoContentEl = todoContentDe.nativeElement;
    });

    describe('todo row', () => {
      it('should verify todo row default render', () => {
        todoRowContainerEl = fixture.nativeElement.querySelector(CSS_SELECTORS.TODO_ROW_CONTAINER);

        expect(todoRowContainerEl).toBeTruthy();
        expect(todoRowContainerEl.classList).not.toContain(BOOTSTRAP_CSS_CLASSES.EDIT_PADDING);

        const getAttributesValue = (type: string) => todoRowContainerEl.attributes.getNamedItem(type)?.value;

        expect(getAttributesValue('data-bs-toggle')).toEqual('tooltip');
        expect(getAttributesValue('data-bs-placement')).toEqual('top');
        expect(getAttributesValue('data-bs-html')).toEqual('true');
        expect(getAttributesValue('data-bs-title')).toEqual(
          "- One click redirect to the todo page.<br>- Double-click or press 'E' to enter edit content mode.",
        );
      });
    });

    describe('checkbox input', () => {
      let checkboxDe: DebugElement;
      let checkboxEl: HTMLInputElement;
      let closeEl: HTMLButtonElement;

      beforeEach(() => {
        checkboxDe = fixture.debugElement.query(By.css('[type="checkbox"]'));
        checkboxEl = checkboxDe.nativeElement;
        closeEl = fixture.nativeElement.querySelector('.btn-close');
      });

      it('should check & apply completed styles', fakeAsync(() => {
        checkboxDe.triggerEventHandler('click');
        fixture.detectChanges();

        expect(checkboxEl.disabled).toBeTrue();
        expect(closeEl.disabled).toBeTrue();

        tick(ON_COMPLETE_DELAY_MS);
        fixture.detectChanges();

        expect(checkboxEl.checked).toBeTrue();
        expect(checkboxEl.disabled).toBeFalse();
        expect(closeEl.disabled).toBeFalse();

        expect(todoContentEl.classList).toContain(BOOTSTRAP_CSS_CLASSES.COMPLETED);
      }));

      it('should uncheck & remove completed styles', fakeAsync(() => {
        checkboxDe.triggerEventHandler('click');
        tick(ON_COMPLETE_DELAY_MS);
        fixture.detectChanges();

        checkboxDe.triggerEventHandler('click');
        tick(ON_COMPLETE_DELAY_MS);
        fixture.detectChanges();

        expect(checkboxEl.checked).toBeFalse();
        expect(closeEl.disabled).toBeFalse();
        expect(todoContentEl.classList).not.toContain(BOOTSTRAP_CSS_CLASSES.COMPLETED);
      }));
    });

    describe('label', () => {
      let location: Location;

      beforeEach(fakeAsync(() => {
        location = TestBed.inject(Location);

        router.initialNavigation();
        tick();

        fixture.detectChanges();

        todoInfoWrapperEl = todoContentDe.parent?.nativeElement;
      }));

      it('should click on todo label & redirect to todo page', fakeAsync(() => {
        todoContentDe.triggerEventHandler('click');
        tick(DOUBLE_CLICK_DELAY_MS);
        fixture.detectChanges();

        expect(location.path()).toMatch(/todo\/[a-zA-Z0-9-]+$/);
      }));

      it('should double-click on todo label & enter edit mode', fakeAsync(() => {
        todoContentDe.triggerEventHandler('click');
        tick(DELAY_BETWEEN_EACH_CLICK_MS);
        todoContentDe.triggerEventHandler('click');
        fixture.detectChanges();

        todoRowContainerEl = fixture.nativeElement.querySelector(CSS_SELECTORS.TODO_ROW_CONTAINER);
        expect(todoRowContainerEl.classList).toContain(BOOTSTRAP_CSS_CLASSES.EDIT_PADDING);

        expect(todoInfoWrapperEl.classList).toContain(BOOTSTRAP_CSS_CLASSES.HIDDEN);

        editContentInputDe = fixture.debugElement.query(By.css(CSS_SELECTORS.EDIT_CONTENT_INPUT));
        expect(editContentInputDe).toBeTruthy();
      }));

      it('should enter edit mode when pressing "E" key', () => {
        todoContentDe.triggerEventHandler('keyup.e');
        fixture.detectChanges();

        editContentInputDe = fixture.debugElement.query(By.css(CSS_SELECTORS.EDIT_CONTENT_INPUT));
        expect(editContentInputDe).toBeTruthy();
      });

      it('should modify todo content', () => {
        const newContent = 'new content';

        todoContentDe.triggerEventHandler('keyup.e');
        fixture.detectChanges();

        editContentInputDe = fixture.debugElement.query(By.css(CSS_SELECTORS.EDIT_CONTENT_INPUT));
        editContentInputEl = fixture.nativeElement.querySelector('.edit-mode-input');

        editContentInputEl.value = newContent;
        editContentInputEl.dispatchEvent(new Event('input'));
        editContentInputDe.triggerEventHandler('keydown.enter');

        fixture.detectChanges();

        editContentInputEl = fixture.nativeElement.querySelector('.edit-mode-input');
        expect(editContentInputEl).toBeFalsy();
        expect(todoContentEl.textContent).toEqual(newContent);
      });
    });

    describe('edit content input', () => {
      let editContentInputDeAfterBlur: DebugElement;

      beforeEach(() => {
        todoContentDe.triggerEventHandler('keyup.e');
        fixture.detectChanges();
        editContentInputDe = fixture.debugElement.query(By.css(CSS_SELECTORS.EDIT_CONTENT_INPUT));
      });

      it('should exit edit mode when pressing "Enter" key', () => {
        editContentInputDe.triggerEventHandler('keydown.enter');
        fixture.detectChanges();

        editContentInputDeAfterBlur = fixture.debugElement.query(By.css(CSS_SELECTORS.EDIT_CONTENT_INPUT));
        expect(editContentInputDeAfterBlur).toBeFalsy();

        todoContentDe = fixture.debugElement.query(By.css('label'));
        expect(todoContentDe).toBeTruthy();

        todoInfoWrapperEl = todoContentDe.parent?.nativeElement;
        expect(todoInfoWrapperEl.classList).not.toContain(BOOTSTRAP_CSS_CLASSES.HIDDEN);

        todoRowContainerEl = fixture.nativeElement.querySelector('.todo-row');
        expect(todoRowContainerEl.classList).not.toContain(BOOTSTRAP_CSS_CLASSES.EDIT_PADDING);
      });

      it('should exit edit mode on blur', () => {
        editContentInputDe = fixture.debugElement.query(By.css(CSS_SELECTORS.EDIT_CONTENT_INPUT));
        editContentInputDe.triggerEventHandler('blur');
        fixture.detectChanges();

        editContentInputDeAfterBlur = fixture.debugElement.query(By.css(CSS_SELECTORS.EDIT_CONTENT_INPUT));
        expect(editContentInputDeAfterBlur).toBeFalsy();
      });
    });
  });
});
