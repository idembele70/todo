import { DatePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-todo-row',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './todo-row.component.html',
  styleUrl: './todo-row.component.css'
})
export class TodoRowComponent {
  @Input() todo: Todo;
  disableCheckbox: boolean;
  disableCloseBtn: boolean;
  @Output() deleteTodo: EventEmitter<unknown>;
  constructor(private todoService: TodoService) {
    this.todo = {
      id: "id-default-xyz",
      content: 'content-default',
      createdAt: new Date(),
      done: false
    };
    this.disableCheckbox = false;
    this.disableCloseBtn = false;
    this.deleteTodo = new EventEmitter();
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

  onDelete() {
    this.disableCheckbox = true;
    this.disableCloseBtn = true;
    // Simulate server request/response time.
    setTimeout(() => {
      this.todoService.deleteOneTodo(this.todo.id);
      this.deleteTodo.emit();
      this.disableCheckbox = false;
      this.disableCloseBtn = false;
    }, 100);
  }
}
