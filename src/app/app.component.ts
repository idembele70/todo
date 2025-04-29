import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private readonly todoService: TodoService) {}

  addTodo(event: SubmitEvent, content: string) {
    this.todoService.addTodo(event, content)
  }

  toggleDone(id: number) {
    this.todoService.toggleDone(id)
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id)
  }

  get todos() {
    return this.todoService.todos
  }
}
