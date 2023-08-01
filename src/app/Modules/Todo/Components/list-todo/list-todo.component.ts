import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, combineLatest, debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs';
import { Category } from 'src/app/Interfaces/ICategory.interface';
import { Todo } from 'src/app/Interfaces/ITodo.interface';
import { CategoryService } from 'src/app/Services/categoryService/category.service';
import { TodoService } from 'src/app/Services/todoService/todo.service';
import { FilterTodoComponent } from '../filter-todo/filter-todo.component';
import { CategoryNamePipe } from 'src/app/Pipes/category-name.pipe';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  standalone:true,
  imports:[
    CommonModule,
    ReactiveFormsModule,
    FilterTodoComponent,
    CategoryNamePipe
  ],
  providers:[
  ],
  styleUrls: ['./list-todo.component.scss']
})
export class ListTodoComponent implements OnDestroy {
  // Constructor with service injections
   constructor(public categoryService:CategoryService,private todoService:TodoService ) {
    // Initialize form controls
    this.editTitleControl = this.editTodoForm.get('title') as FormControl;
    this.editCategoryIdControl = this.editTodoForm.get('categoryId') as FormControl;  
  }
  // Observables to manage Todos and Categories data streams
  todos$ !:Observable<Todo[]>;
  categories$ !:Observable<Category[]>;
  filteredTodos$ !: Observable<Todo[]>;
  private ngUnsubscribe = new Subject<void>();
  // FormControls for search and category filter functionalities
  searchControl = new FormControl();
  categoryControl = new FormControl();
  // Array to define column titles in the Todo table
  todoTitles=["Todo","Category","Operations"];
  ngOnInit(): void {
    // Fetching data from services
    this.todos$=this.todoService.getTodos();
    this.categories$=this.categoryService.getCategories();
    // Logic to filter Todos based on search and category selection
    // Baska bir degiskene ata, takeuntil hepsine koymana gerek yok
    this.filteredTodos$ = combineLatest([
      this.todos$.pipe(),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(500),
      ),
      this.categoryControl.valueChanges.pipe(startWith(''))
    ]).pipe(map(([todos, searchTerm, category]) => 
    {
        console.log(todos);
        console.log(searchTerm);
        console.log(category);
        let filtered = todos;
        if (searchTerm && searchTerm.length>0) {
          filtered = filtered.filter(todo => todo.title.includes(searchTerm));
        }
        if (category) {
          filtered = filtered.filter(todo => todo.categoryId == category);
        }
        return filtered;
      })
    );
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  // Form control definitions
  editTitleControl: FormControl;
  editCategoryIdControl: FormControl;
  // FormGroup definitions
  todoForm=new FormGroup({
    'title':new FormControl(null,[Validators.required,Validators.minLength(2)]),
    'categoryId':new FormControl(0,[Validators.required,Validators.min(1)])
  });
  editTodoForm =  new FormGroup({
    'title': new FormControl(''),
    'categoryId': new FormControl(0)
  });
  // Property to manage editing state
  editingId: number | null = null;
  // Method to handle edit operation
  onEdit(id: number, todo: Todo) {
    this.editingId = id;
    this.editTodoForm.setValue({
      'title': todo.title,
      'categoryId': todo.categoryId
    });
  }
  //Service'de yapılabilir
  // Method to handle save operation after edit
  onSave(todo: Todo) {
    todo.title = this.editTodoForm.value.title ? this.editTodoForm.value.title : '';
    todo.categoryId = this.editTodoForm.value.categoryId ? this.editTodoForm.value.categoryId : 0;
    this.todoService.updateTodo(todo); 
    this.editingId = null;
  }
  // Method to cancel edit operation
  onCancel() {
    this.editingId = null;
  }
  // Method to handle delete operation
  onDelete(id: number) {
    this.todoService.deleteTodo(id);
  }  

}
