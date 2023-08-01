import { Component } from '@angular/core';
import { AddCategoryComponent } from '../../Components/add-category/add-category.component';
import { ListCategoriesComponent } from '../../Components/list-categories/list-categories.component';
import { TitleBlockComponent } from 'src/app/Modules/Shared/title-block/title-block.component';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone:true,
  imports:[
    AddCategoryComponent,
    ListCategoriesComponent,
    TitleBlockComponent
  ]
})
export class CategoryComponent {
  title:string='Categories';
}
