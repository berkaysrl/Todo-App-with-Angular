import { Injectable } from '@angular/core';
import { parse } from 'protobufjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from 'src/app/interfaces/ITodo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private todos$ = this.todoSubject.asObservable();
  private todoIdCounter = 1; 
  constructor() { 
    this.loadInitialData();
  }
  private loadInitialData() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      const todos = JSON.parse(storedTodos);
      this.todoSubject.next(todos);
      this.todoIdCounter = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
    }
  }
  public getTodos(): Observable<Todo[]> {
    return this.todos$;
  }
  deleteTodo(todoId: number): void {
    const currentTodos = this.todoSubject.value;
    const updatedTodos = currentTodos.filter(todo => todo.id !== todoId); // ID'ye göre kullanıcıyı filtrele
    this.todoSubject.next(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }
  addTodo(todo: Todo): void {
    todo.categoryId=todo.categoryId*1;
    const newTodo = {title:todo.title,categoryId:todo.categoryId ,id: this.todoIdCounter++ };
    const currentTodos = this.todoSubject.value;
    const updatedTodos = [...currentTodos, newTodo];
    this.todoSubject.next(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }
  updateTodo(updatedTodo: Todo): void {
    const currentTodos = this.todoSubject.value;
    const index = currentTodos.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      currentTodos[index] = updatedTodo;
      this.todoSubject.next(currentTodos);
      localStorage.setItem('todos', JSON.stringify(currentTodos));
    } else {
      console.error('Kategori bulunamadı!');
    }
}
}
