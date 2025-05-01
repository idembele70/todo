import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddTodoComponent } from "./components/add-todo/add-todo.component";
import { TodoListComponent } from "./components/todo-list/todo-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AddTodoComponent, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


}
