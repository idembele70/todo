import { Component } from '@angular/core';
import { AddTodoComponent } from '../../components/add-todo/add-todo.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AddTodoComponent, TodoListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
