import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Category } from 'src/app/Interfaces/ICategory.interface';
import { CategoryService } from 'src/app/Services/categoryService/category.service';
import { TodoService } from 'src/app/Services/todoService/todo.service';

@Component({
  selector: 'app-add-todo',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit{
  // Observable for list of categories
  private ngUnsubscribe = new Subject<void>();
  categories$ !:Observable<Category[]>;
  // Form definition for adding a todo
  todoForm=new FormGroup({
    'title':new FormControl(null,[Validators.required,Validators.minLength(2)]),
    'categoryId':new FormControl(0,[Validators.required,Validators.min(1)])
  });
  // Constructor to inject the required services
  constructor(public categoryService:CategoryService,private todoService:TodoService ) {
  }
  ngOnInit(): void {
    // Fetch the list of categories on initialization
    this.categories$ = this.categoryService.getCategories().pipe(takeUntil(this.ngUnsubscribe));
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Method to handle the submission of the form
  onSubmitTodoForm()
  {
    // Check if the form is valid
    if(!this.todoForm.invalid)
    {
      this.todoService.addTodo(
      {
      id:1,
      categoryId:this.todoForm.value['categoryId']? this.todoForm.value['categoryId']: 0,
      title:this.todoForm.value['title'] ? this.todoForm.value['title'] : ''
      });
      this.todoForm.reset();
      alert("Adding todo is successful.");

    }
    else
    {
      alert("Adding todo is failed.");
    }
  }
}
