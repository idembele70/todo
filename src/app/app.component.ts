import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Todo } from './Todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private _todos: Todo[] = [
    {
      id:1, content: 'Todo 1', done: false, createdAt: new Date()
    },
    {
      id:2, content: 'Todo 2', done: true, createdAt: new Date(),
    }
  ]

  get todos() {
    return this._todos
  }

  addTodo(event: SubmitEvent, content: string) {
    event.preventDefault();
    this._todos.push(
      {
        id: this._todos.length + 1,
        content,
        done: false,
        createdAt: new Date()
      }
    )
    }

  toggleDone(id:number) {
    const todo = this._todos.find(todo => todo.id === id)
    if(todo)
      todo.done = !todo.done
    }

  deleteTodo(id: number) {
    this._todos = this._todos.filter(todo => todo.id !== id)
  }
}
