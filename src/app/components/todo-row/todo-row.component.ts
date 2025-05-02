import { DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  constructor(private todoService: TodoService) {
    this.todo = {
      id: "id-default-xyz",
      content: 'content-default',
      createdAt: new Date(),
      done: false
    };
    this.disableCheckbox = false;
    this.disableCloseBtn = false;
  }

  onComplete() {
    this.disableCheckbox = true;
    this.disableCloseBtn = true;
    // Simulate server request/response time.
    setTimeout(() => {
      this.todoService.toggleCompletedTodo(this.todo.id);
      this.disableCheckbox = false;
      this.disableCloseBtn = false;
    }, 500);
  }
}
