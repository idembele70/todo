import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css',
})
export class AddTodoComponent implements OnInit, OnDestroy {
  public newTodoText = '';
  public todosSubscription: Subscription;
  public todos: Todo[];
  public disableAddBtn: boolean;
  public disableAddInput: boolean;
  constructor(private todoService: TodoService) {
    this.todosSubscription = new Subscription();
    this.todos = [];
    this.disableAddBtn = true;
    this.disableAddInput = false;
  }

  ngOnInit(): void {
    this.todosSubscription = this.todoService.todoSubject.subscribe({
      next: (todos: Todo[]) => {
        this.todos = todos;
      },
      error: (err) => {
        console.error('An error has occurred when subscribing to todoSubject', err);
      },
    });
    this.todoService.emitTodos();
  }

  ngOnDestroy(): void {
    this.todosSubscription.unsubscribe();
  }

  public onUpdateNewTodoText() {
    const trimmedText = this.newTodoText.trim();
    const todoExists = this.todoService.todoExists(trimmedText);

    this.disableAddBtn = trimmedText === '' || todoExists;
  }

  get isAddDisabled(): boolean {
    return this.disableAddBtn || this.newTodoText.trim() === '';
  }

  public onAddTodo() {
    if (this.isAddDisabled) return;

    this.setInputState(true);

    this.todoService.addTodo(this.newTodoText.trim());
    this.newTodoText = '';
    this.todoService.emitTodos();

    this.setInputState(false);
  }

  private setInputState(disabled: boolean): void {
    this.disableAddInput = disabled;
    this.disableAddBtn = disabled;
  }
}
