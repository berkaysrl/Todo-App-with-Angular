import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs';
import { Category } from 'src/app/interfaces/ICategory.interface';
import { Todo } from 'src/app/interfaces/ITodo.interface';
import { CategoryService } from 'src/app/services/Category/category.service';
import { TodoService } from 'src/app/services/Todo/todo.service';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.css']
})
export class TodoAddComponent implements OnInit{
  constructor(public categoryService:CategoryService,private todoService:TodoService ) {
    this.editTitleControl = this.editTodoForm.get('title') as FormControl;
    this.editCategoryIdControl = this.editTodoForm.get('categoryId') as FormControl;  
  }
  //Services
  //Services end
  //Category and Todo Observable List Definition
  todos$ !:Observable<Todo[]>;
  categories$ !:Observable<Category[]>;
  filteredTodos$ !: Observable<Todo[]>;
  //Category and Todo Observable List Definition end
  //Search FormControl's Definitions
    searchControl = new FormControl();
    categoryControl = new FormControl();
  //Search FormControl's Definitions end
  todoTitles=["ID","Todo","Category","Operations"];
  ngOnInit(): void {
    //Data binding from service
    this.todos$=this.todoService.getTodos();
    this.categories$=this.categoryService.getcategories();
    //Data binding end
    this.filteredTodos$ = combineLatest([
      this.todos$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(2000),
        distinctUntilChanged()
      ),
      this.categoryControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([todos, searchTerm, category]) => {
        let filtered = todos;
        if (searchTerm) {
          filtered = filtered.filter(todo => todo.title.includes(searchTerm));
        }
        if (category) {
          filtered = filtered.filter(todo => todo.categoryId === category);
        }
        return filtered;
      })
    );
  }
  //FormControl Objects
    editTitleControl: FormControl;
    editCategoryIdControl: FormControl;
  //
  //FormGroup Objects
  todoForm=new FormGroup({
    'title':new FormControl(null,[Validators.required,Validators.minLength(2)]),
    'categoryId':new FormControl(0,[Validators.required,Validators.min(1)])
  });
  editTodoForm =  new FormGroup({
    'title': new FormControl(''),
    'categoryId': new FormControl(0)
  });
  //
  editingId: number | null = null;
  onSubmitTodoForm()
  {
    this.todoService.addTodo(
    {
    id:1,
    categoryId:this.todoForm.value['categoryId']? this.todoForm.value['categoryId']: 0,
    title:this.todoForm.value['title'] ? this.todoForm.value['title'] : ''
    });
    this.todoForm.reset();
  }
  onEdit(id: number, todo: Todo) {
    this.editingId = id;
    this.editTodoForm.setValue({
      'title': todo.title,
      'categoryId': todo.categoryId
    });
  }
  onSave(todo: Todo) {
    todo.title = this.editTodoForm.value.title ? this.editTodoForm.value.title : '';
    todo.categoryId = this.editTodoForm.value.categoryId ? this.editTodoForm.value.categoryId : 0;
    this.todoService.updateTodo(todo); 
    this.editingId = null;
  }
  onCancel() {
    this.editingId = null;
  }
  onDelete(id: number) {
    this.todoService.deleteTodo(id);
  }
  //pipe'a donusturup dene 
  getCategoryNameById(id: number): string {
    const name = this.categoryService.getCategoryNameById(id);
    return name;
  }
}
