import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Path } from '@app/models/path.type';
import { TodoService } from '@app/services/todo/todo.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit, OnDestroy {
  itemCount = 0;
  readonly destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.todoService.filteredTodos$.pipe(takeUntil(this.destroy$)).subscribe((todos) => {
      this.itemCount = todos.length;
    });

    this.activatedRoute.url.pipe(takeUntil(this.destroy$)).subscribe((segments) => {
      const currentPath = segments[0]?.path as Path;
      this.todoService.emitPath(currentPath ?? 'all');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
