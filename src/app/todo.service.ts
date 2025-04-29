import { Injectable } from '@angular/core';
import { Todo } from './Todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor() { }

   todos: Todo[] = [
    {
      id:1, content: 'Todo 1', done: false, createdAt: new Date()
    },
    {
      id:2, content: 'Todo 2', done: true, createdAt: new Date(),
    }
  ]

  addTodo(event: SubmitEvent, content: string) {
    event.preventDefault();
    this.todos.push(
      {
        id: this.todos.length + 1,
        content,
        done: false,
        createdAt: new Date()
      }
    )
    }

  toggleDone(id:number) {
    const todo = this.todos.find(todo => todo.id === id)
    if(todo)
      todo.done = !todo.done
    }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id)
  }
}
