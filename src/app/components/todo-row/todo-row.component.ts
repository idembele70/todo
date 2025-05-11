import { NgClass, NgIf } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Tooltip } from 'bootstrap';
import { Todo } from '../../models/todo.model.';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-todo-row',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './todo-row.component.html',
  styleUrl: './todo-row.component.css',
})
export class TodoRowComponent implements AfterViewChecked, AfterViewInit {
  @Input() todo: Todo;

  disableCheckbox: boolean;
  disableCloseBtn: boolean;

  @Output() deleteTodo: EventEmitter<unknown>;

  isEditing: boolean;
  private currentContent: string;

  editInputFormControl = new FormControl();

  @ViewChild('editInputRef') inputRef?: ElementRef;
  @ViewChild('todoRowRef', { static: false }) todoRowRef?: ElementRef;

  private TooltipInstance?: Tooltip;
  private hasFocusedInput: boolean;

  constructor(private todoService: TodoService) {
    this.todo = {
      id: 'id-default-xyz',
      content: 'content-default',
      createdAt: new Date(),
      done: false,
    };
    this.disableCheckbox = false;
    this.disableCloseBtn = false;

    this.deleteTodo = new EventEmitter();
    this.isEditing = false;
    this.currentContent = '';

    this.hasFocusedInput = false;
  }

  onComplete() {
    this.disableCheckbox = true;
    this.disableCloseBtn = true;
    // Simulate server request/response time.
    setTimeout(() => {
      this.todoService.toggleCompletedTodo(this.todo.id);
      this.disableCheckbox = false;
      this.disableCloseBtn = false;
    }, 100);
  }

  private performDeletion() {
    this.todoService.deleteOneTodo(this.todo.id);
    this.deleteTodo.emit();
  }

  onDelete() {
    this.disableCheckbox = true;
    this.disableCloseBtn = true;
    // Simulate server request/response time.
    setTimeout(() => {
      this.destroyTooltip();
      this.performDeletion();
      this.disableCheckbox = false;
      this.disableCloseBtn = false;
    }, 100);
  }

  onEnterEditMode() {
    this.isEditing = true;

    const content = this.todo.content;
    this.currentContent = content;
    this.editInputFormControl.setValue(content);
    this.destroyTooltip();
  }

  onSave() {
    const newContent = this.editInputFormControl.value?.trim() ?? '';

    if (!newContent) this.performDeletion();
    else if (this.currentContent !== newContent) this.todoService.editContent(this.todo.id, newContent);

    if (this.todoRowRef?.nativeElement) this.createTooltip();

    this.isEditing = false;
    this.hasFocusedInput = false;
  }

  ngAfterViewChecked(): void {
    if (this.isEditing && !this.hasFocusedInput && this.inputRef) {
      this.inputRef.nativeElement.focus();
      this.hasFocusedInput = true;
    }
  }

  ngAfterViewInit(): void {
    this.createTooltip();
  }

  private createTooltip() {
    if (this.todoRowRef?.nativeElement) this.TooltipInstance = new Tooltip(this.todoRowRef.nativeElement);
  }

  private destroyTooltip() {
    if (this.TooltipInstance) {
      this.TooltipInstance.dispose();
    }
  }
}
