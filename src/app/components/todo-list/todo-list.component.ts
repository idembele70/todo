import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoRowComponent } from "../todo-row/todo-row.component";
import { Subscription } from 'rxjs';
import { TodoService } from '../../services/todo/todo.service';
import { Todo } from '../../models/todo';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoRowComponent, NgForOf],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit, OnDestroy {
  public todosSubscription: Subscription;
  public todos: Todo[];

  constructor(private todoService: TodoService) {
    this.todosSubscription = new Subscription();
    this.todos = []
  }

  ngOnInit(): void {
      this.todosSubscription = this.todoService.todoSubject.subscribe(
        {
          next: (todos: Todo[]) => {
            this.todos = todos
          },
          error: (err)=> {
            console.error(
              'An error has occured when subscribing to todoSubject',
              err
            );
          }
        }
      )
      this.todoService.emitTodos()
  }

  ngOnDestroy(): void {
      this.todosSubscription.unsubscribe()
  }
}
