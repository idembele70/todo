import { Component, Input } from '@angular/core';
import { Todo } from '../../models/todo';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-todo-row',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './todo-row.component.html',
  styleUrl: './todo-row.component.css'
})
export class TodoRowComponent {
  @Input() todo: Todo;

  constructor() {
    this.todo = {
      id: "id-default-xyz",
      content: 'content-default',
      createdAt: new Date(),
      done: false
    }
  }
}
