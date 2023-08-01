import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
      // Set the next ID based on the last todo's ID or start from 1.
      this.todoIdCounter = storedTodos.length > 0 ? storedTodos[storedTodos.length - 1].id + 1 : 1;
    }
  }
  //Returns an observable of the current list of todos.
  public getTodos(): Observable<Todo[]> {
    return this.todos$;
  }
  //Deletes a todo based on its ID.
  deleteTodo(todoId: number): void {
    const currentTodos = this.todoSubject.value;
    const updatedTodos = currentTodos.filter(todo => todo.id !== todoId);
    this.todoSubject.next(updatedTodos);
    // Update the local storage with the new list.
    this.storageService.set('todos', updatedTodos);
  }
  // Adds a new todo to the list.
  addTodo(todo: Todo): void {
    todo.categoryId=todo.categoryId*1;
    const newTodo = {title:todo.title, categoryId:todo.categoryId, id: this.todoIdCounter++ };
    const currentTodos = this.todoSubject.value;
    const updatedTodos = [...currentTodos, newTodo];
    this.todoSubject.next(updatedTodos);
    // Update the local storage with the new list.
    this.storageService.set('todos', updatedTodos);
  }
  //Updates the details of an existing todo.
  updateTodo(updatedTodo: Todo): void {
    updatedTodo.categoryId=updatedTodo.categoryId*1;
    const currentTodos = this.todoSubject.value;
    const index = currentTodos.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      currentTodos[index] = updatedTodo;
      this.todoSubject.next(currentTodos);
      // Update the local storage with the modified  w list.
      this.storageService.set('todos', currentTodos);
    } 
  }
}
