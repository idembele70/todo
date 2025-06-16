import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app.routes';
import { Subscription } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css',
})
export class AddTodoComponent implements OnInit, OnDestroy {
  public newTodoText: string;
  public todosSubscription: Subscription;
  public todos: Todo[];
  public disableAddBtn: boolean;
  public disableAddInput: boolean;
  public hasNoActiveTodos = true;

  constructor(
    private todoService: TodoService,
    private router: Router,
  ) {
    this.newTodoText = '';
    this.todosSubscription = new Subscription();
    this.todos = [];
    this.disableAddBtn = true;
    this.disableAddInput = false;
  }

  ngOnInit(): void {
    this.todosSubscription = this.todoService.todoSubject.subscribe({
      next: (todos) => {
        this.todos = todos;
        this.hasNoActiveTodos = todos.every((t) => t.done);
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

  public get isActiveTodosView(): boolean {
    return this.router.url === APP_ROUTES.HOME_ACTIVE;
  }

  public onToggleCompleteTodos(event: MouseEvent) {
    if (!this.isChecked) this.todoService.completeAllActiveTodos();
    else this.todoService.incompleteAllTodos();

    if (this.isActiveTodosView) event.preventDefault();
  }

  public get isChecked(): boolean {
    return !this.isActiveTodosView && this.hasNoActiveTodos && !!this.todos.length;
  }

  public get isCheckboxDisabled(): boolean {
    if (!this.todos.length) return true;

    const isCompletedTodosView = this.router.url === APP_ROUTES.HOME_COMPLETED;
    if (isCompletedTodosView && !this.hasNoActiveTodos) return true;

    if (this.isActiveTodosView && (!this.todos.length || this.hasNoActiveTodos)) return true;

    return false;
  }

  public get ariaLabel(): string {
    return this.isChecked ? 'Mark all completed todos as incomplete' : 'Mark all active todos as completed';
  }
}
