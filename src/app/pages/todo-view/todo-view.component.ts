import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APP_ROUTES } from '../../core/constants/app.routes';
import { createEmptyTodo } from '../../core/utils/todo.factory';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo/todo.service';

@Component({
  selector: 'app-todo-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './todo-view.component.html',
  styleUrl: './todo-view.component.css',
})
export class TodoViewComponent implements OnInit, OnDestroy {
  todo: Todo;
  todoSubscription: Subscription;
  readonly datePipeFormat: 'medium';

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
  ) {
    this.todo = createEmptyTodo();
    this.todoSubscription = new Subscription();
    this.datePipeFormat = 'medium';
  }

  ngOnInit(): void {
    this.loadTodo();
  }

  ngOnDestroy(): void {
    this.todoSubscription.unsubscribe();
  }

  public get isDone(): boolean {
    return this.todo.done;
  }

  public get completeButtonLabel(): string {
    return this.todo.done ? 'Incomplete' : 'Complete';
  }

  public get lastUpdateLabel(): string | number {
    return this.datePipe.transform(this.todo.updatedAt, this.datePipeFormat) ?? 'Never updated';
  }

  private loadTodo() {
    const id = this.route.snapshot.params['id'];
    this.todoSubscription = this.todoService.getOneTodo(id).subscribe((todo) => {
      if (!todo) {
        this.router.navigate([APP_ROUTES.HOME_ALL]);
        return;
      }
      this.todo = todo;
    });
  }

  onSave() {
    const content = this.todo.content.trim();
    if (!content) {
      this.onDelete();
      return;
    }
    this.todoService.editContent(this.todo.id, content);
  }

  onToggleComplete() {
    this.todoService.toggleCompletedTodo(this.todo.id);
  }

  onDelete() {
    this.todoService.deleteOneTodo(this.todo.id);
    this.router.navigate([APP_ROUTES.HOME_ALL]);
  }
}
