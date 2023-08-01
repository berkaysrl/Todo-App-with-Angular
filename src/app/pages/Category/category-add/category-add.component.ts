import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/Category/category.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent {
  categoryService=inject(CategoryService);
  categoryForm=new FormGroup({
    'name':new FormControl(null,[Validators.required,Validators.minLength(2)]),
  });
  onSubmitCategoryForm()
  {
    this.categoryService.addCategory({id:1,name:this.categoryForm.value['name'] ? this.categoryForm.value['name'] : ''});
    console.log(this.categoryService.getcategories());
    this.categoryForm.reset();
  }
}
