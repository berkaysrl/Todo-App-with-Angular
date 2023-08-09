import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Todo } from 'src/app/Interfaces/ITodo.interface';
import { StorageService } from '../storageService/storage.service';

@Injectable({
  providedIn: 'root' // This service will be provided at the root level, making it a singleton across the app
})
export class TodoService {
  // Subject to handle and manage the list of Todos.
  private todoSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  // Observable to expose the todos for subscribers.
  private todos$ = this.todoSubject.asObservable();
  // Counter to generate unique IDs for todos.
  private todoIdCounter = 1; 
  constructor(private storageService: StorageService) {
      // Load initial todo data when the service is instantiated.
    this.loadInitialData();
  }
  //Loads the initial list of todos from local storage.
  private loadInitialData() {
    const storedTodos = this.storageService.get('todos');
    if (storedTodos) {
      this.todoSubject.next(storedTodos);
      // Determine the next available ID based on the last todo's ID. If no todos are present, start from 1.
      this.todoIdCounter = storedTodos.length > 0 ? storedTodos[storedTodos.length - 1].id + 1 : 1;
    }
  }
   
  // Method to get the next available todo ID.
  public getTodoId():number
  {
    return this.todoIdCounter
  }

  // Method to retrieve the current list of todos.
  public getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  // Method to delete a todo using its ID.
  deleteTodo(todoId: number): void {
    const currentTodos = this.todoSubject.value;
    const updatedTodos = currentTodos.filter(todo => todo.id !== todoId);
    this.todoSubject.next(updatedTodos);
    // After deletion, update the list in local storage.
    this.storageService.set('todos', updatedTodos);
  }
  // Method to add a new todo to the list.
  addTodo(todo: Todo): void {
    todo.categoryId=todo.categoryId*1;
    const newTodo = {title:todo.title, categoryId:todo.categoryId, id: this.todoIdCounter++ };
    const currentTodos = this.todoSubject.value;
    const updatedTodos = [...currentTodos, newTodo];
    this.todoSubject.next(updatedTodos);
    // Update the local storage with the new list.
    this.storageService.set('todos', updatedTodos);
  }
    
  // Method to update multiple todos at once.
  updateAllTodos(updatedTodos: Todo[]): void {
    const currentTodos = this.todoSubject.value;
     updatedTodos.forEach(
      todo=>
      {
        const index=currentTodos.findIndex(x=>x.id===todo.id);
        if (index !== -1) { 
          currentTodos[index] = todo;
        }
      }
    )
    this.todoSubject.next(currentTodos);
    // Update the list in local storage.
    this.storageService.set('todos', currentTodos); 
  }
  
  
  // Method to filter todos based on search terms and category ID.
  filterTodos(searchTerm: string, categoryId?: number): Todo[] {
    const todos = this.todoSubject.value;
    let filtered = todos;
    // If a search term is provided, filter todos by title.
    if (searchTerm && searchTerm.length > 0) {
      filtered = filtered.filter(todo => todo.title.includes(searchTerm));
    }
    // If a category ID is provided, filter todos by category.
    if (categoryId) {
      filtered = filtered.filter(todo => todo.categoryId == categoryId);
    }
    return filtered;
  }
}
