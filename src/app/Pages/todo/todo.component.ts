import { Component } from '@angular/core';
import { ListTodoComponent } from '../../Modules/Todo/Components/list-todo/list-todo.component';
import { AddTodoComponent } from '../../Modules/Todo/Components/add-todo/add-todo.component';
import { FilterTodoComponent } from '../../Modules/Todo/Components/filter-todo/filter-todo.component';
import { RouterModule } from '@angular/router';
import { TitleBlockComponent } from 'src/app/Modules/Shared/title-block/title-block.component';

@Component({
  selector: 'app-todo',
  standalone:true,
  imports:[
    ListTodoComponent,
    AddTodoComponent,
    FilterTodoComponent,
    TitleBlockComponent,
    RouterModule
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {
  title:string='Todos';

}
