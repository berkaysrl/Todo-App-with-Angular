import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, combineLatest, distinctUntilChanged, map, startWith, tap } from 'rxjs';
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
  //We can see if there is a change from the comparison between this initial form and the real form and we keep as boolean variable it in this variable.
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
        let filtered = todos;
        if (searchTerm && searchTerm.length > 0) {
          filtered = filtered.filter(todo => todo.title.includes(searchTerm));
        }
        if (category) {
          filtered = filtered.filter(todo => todo.categoryId == category);
        }
        return filtered;
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
  // Function to create a FormGroup for a Todo
  createTodoGroup(todo?: Todo): FormGroup {
    return new FormGroup({
      id: new FormControl(todo?.id || null),
      title: new FormControl(todo?.title || '', Validators.required),
      categoryId: new FormControl(todo?.categoryId || 0, Validators.required)
    });
  }
  addTodoRow() {
    if(!this.addTodoGroup.invalid) {
        const todoToAdd: Todo = {
            id: this.addTodoGroup.get('id')?.value || 0,
            title: this.addTodoGroup.get('title')?.value || '',
            categoryId: this.addTodoGroup.get('categoryId')?.value || 0,
        };
        this.todos.push(this.createTodoGroup(todoToAdd));
        this.todoService.addTodo(todoToAdd);
        this.addTodoGroup.reset();
    }
} 
  onSaveAll() {
    const changedTodos = this.getChangedTodos();
    if (changedTodos.length > 0) {
      this.todoService.updateAllTodos(changedTodos);
      this.initialFormData = this.todosForm.value;
    }
  }
  getChangedTodos(): Todo[] {
    const changedTodos: Todo[] = [];
  
    this.todos.controls.forEach(control => {
      if (control instanceof FormGroup && control.dirty) {
        changedTodos.push(control.value);
      }
    });
    return changedTodos;
  }
  // Function to reset form changes
  resetChanges() {
    this.todosForm.reset(this.initialFormData);
  }
  // Function to delete a todo
  onDelete(index: number,id:number) {
    this.todos.removeAt(index);
    this.todoService.deleteTodo(id);
  }
}


