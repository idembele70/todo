import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '../../models/todo.model.';
import { TodoService } from '../../services/todo/todo.service';
import { TodoRowComponent } from '../todo-row/todo-row.component';
import { Path } from '../../models/path.type';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoRowComponent, NgForOf, AsyncPipe],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit, OnDestroy {
  public todos$: Observable<Todo[]>;

  private pathSubscription: Subscription;

  constructor(
    private todoService: TodoService,
    private router: ActivatedRoute,
  ) {
    this.todos$ = this.todoService.filteredTodos$;

    this.pathSubscription = new Subscription();
  }
  ngOnInit(): void {
    this.pathSubscription = this.router.url.subscribe((segments) => {
      const currentPath = segments[0]?.path as Path;
      this.todoService.emitPath(currentPath ?? 'all');
    });
  }

  ngOnDestroy(): void {
    this.pathSubscription.unsubscribe();
  }

  onDeleteOneTodo() {
    console.log('Just wanted to use @Output :p');
  }
}
