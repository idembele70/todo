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
  styleUrl: './add-todo.component.css'
})
export class AddTodoComponent implements OnInit, OnDestroy {
  public newTodoText: string = '';
  public todosSubscription: Subscription;
  public todos: Todo[] = []
  constructor(private todoService: TodoService) {
    this.todosSubscription = new Subscription();
  }

  ngOnInit(): void {
      this.todosSubscription = this.todoService.todoSubject.subscribe(
        {
          next: (todos: Todo[])=>{
            this.todos = todos
          },
          error: (err) => {
              console.error(
                "An error has occured when subscribing to todoSubject",
                err
              );
              
          },
        },
      );
      this.todoService.emitTodos();
  }

  ngOnDestroy(): void {
      this.todosSubscription.unsubscribe()
  }

  public onAddTodo() {
    
  }

}
