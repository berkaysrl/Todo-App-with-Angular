// Importing necessary modules from Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, combineLatest, distinctUntilChanged, map, startWith, tap } from 'rxjs';
// Importing custom interface , service,pipe
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
export class ListTodoComponent {
  //Operation Controls on Pipe
  shouldRebuildForm = true;
  // Observables to manage Todos and Categories data streams
  todos$ !:Observable<Todo[]>;
  categories$ !:Observable<Category[]>;
  filteredTodos$ !: Observable<Todo[]>;
  // FormControls for search and category filter functionalities
  searchControl = new FormControl();
  categoryControl = new FormControl();
  // Array to define column titles in the Todo table
  todoTitles=["Todo","Category","Operations"];
  // FormGroup definitions
  todosForm !: FormGroup;
  // We keep a form to return the value in cancel and reset state.
  initialFormData: any;
  // Flag to determine if form has unsaved changes
  hasChanges: boolean = false;
  // Getter for 'todos' form array
  addTodoGroup=new FormGroup({
    'id':new FormControl(0),
    'title':new FormControl('',[Validators.required]),
    'categoryId':new FormControl(0,[Validators.required,Validators.min(1)])
  });
  get todos(): FormArray {
    return this.todosForm.get('todos') as FormArray;
  }
  // Constructor to inject services
   constructor(public categoryService:CategoryService,private todoService:TodoService ) {
  }
  ngOnInit(): void {
       // Fetching data from services
    this.todos$ = this.todoService.getTodos();
    this.categories$ = this.categoryService.getCategories();
    // Logic to filter Todos based on search and category selection
    this.filteredTodos$ = combineLatest([
        this.todos$.pipe(),
        this.searchControl.valueChanges.pipe(
          startWith(''),
          distinctUntilChanged(),
          tap(() => this.shouldRebuildForm = true)
        ),
        this.categoryControl.valueChanges.pipe(
          startWith(''),
          tap(() => this.shouldRebuildForm = true) 
        )
    ]).pipe(
      map(([todos, searchTerm, category]) => {
        return this.todoService.filterTodos(searchTerm, category);
      })
    );
    this.todosForm = new FormGroup({
      todos: new FormArray([])
    });
    this.filteredTodos$.subscribe(todos => {
      if (this.shouldRebuildForm) {
          this.todos.clear();
          todos.forEach(todo => this.todos.push(this.createTodoGroup(todo)));
          this.shouldRebuildForm=false;
      }
      this.initialFormData=this.todosForm.value;
      this.todosForm.reset(this.initialFormData);
  });
    this.todosForm.valueChanges.subscribe(() => {
      this.hasChanges = JSON.stringify(this.initialFormData) !== JSON.stringify(this.todosForm.value);
    });
  }
  // Helper function to create a FormGroup for a todo
  createTodoGroup(todo?: Todo): FormGroup {
    return new FormGroup({
      id: new FormControl(todo?.id || null),
      title: new FormControl(todo?.title || '', Validators.required),
      categoryId: new FormControl(todo?.categoryId || 0, Validators.required)
    });
  }
    // Add a new todo to the list

  addTodoRow() {
    if(!this.addTodoGroup.invalid) {
        const todoToAdd: Todo = {
            id: this.todoService.getTodoId(),
            title: this.addTodoGroup.get('title')?.value || '',
            categoryId: this.addTodoGroup.get('categoryId')?.value || 0,
        };
        this.todos.push(this.createTodoGroup(todoToAdd));
        this.todoService.addTodo(todoToAdd);
        this.addTodoGroup.reset();
    }
  } 
   // Save all the changes made in the todos list
  /*
  When we change a value and revert it back, it becomes dirty. 
  So, if the user modifies a value and makes it dirty,
  when they click 'save all', that column gets updated again. 
  However, instead of writing an n^n algorithm,
    it seems more logical to me to have it work directly in o(n) manner.
  */
   // Save all the changes made in the todos list
  onSaveAll() {
    const changedTodos = this.getChangedTodos();
    if (changedTodos.length > 0) {
      this.todoService.updateAllTodos(changedTodos);
    }
  }
  // Helper function to get todos that have been changed
  getChangedTodos(): Todo[] {
    const changedTodos: Todo[] = [];
    this.todos.controls.forEach(control => {
      if (control instanceof FormGroup && control.dirty) {
        changedTodos.push(control.value);
      }
    });
    return changedTodos;
  }
  // Reset the form to its initial state
  resetChanges() {
    this.todosForm.reset(this.initialFormData);
  }
  // Function to delete a todo
  onDelete(index: number,id:number) {
    this.todos.removeAt(index);
    this.todoService.deleteTodo(id);
  }
}


