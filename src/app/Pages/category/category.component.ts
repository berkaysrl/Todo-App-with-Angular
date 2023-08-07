import { Component } from '@angular/core';
import { ListCategoriesComponent } from '../../Modules/Category/Components/list-categories/list-categories.component';
import { TitleBlockComponent } from 'src/app/Modules/Shared/title-block/title-block.component';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone:true,
  imports:[
    ListCategoriesComponent,
    TitleBlockComponent
  ]
})
export class CategoryComponent {
  title:string='Categories';
}
