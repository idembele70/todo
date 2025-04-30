import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoRowComponent } from './todo-row.component';

describe('TodoRowComponent', () => {
  let component: TodoRowComponent;
  let fixture: ComponentFixture<TodoRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
