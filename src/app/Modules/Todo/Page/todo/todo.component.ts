import { Component } from '@angular/core';
import { ListTodoComponent } from '../../Components/list-todo/list-todo.component';
import { AddTodoComponent } from '../../Components/add-todo/add-todo.component';
import { FilterTodoComponent } from '../../Components/filter-todo/filter-todo.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo',
  standalone:true,
  imports:[
    ListTodoComponent,
    AddTodoComponent,
    FilterTodoComponent,
    RouterModule
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {

}
