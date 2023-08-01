import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/Services/categoryService/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  standalone:true,
  imports:[ReactiveFormsModule]
})
export class AddCategoryComponent {
  constructor(private categoryService: CategoryService) { }
  //Form group for adding categories
  addCategoryForm=new FormGroup({
    'name':new FormControl(null,[Validators.required]),
  });
  // Method to handle form submission
  onSubmitCategoryForm()
  {
    // Check if form is not invalid
    if(!this.addCategoryForm.invalid)
    {
    // Call the addCategory method from CategoryService
    this.categoryService.addCategory({id:1,name:this.addCategoryForm.value['name'] ? this.addCategoryForm.value['name'] : ''});
    this.addCategoryForm.reset();
    alert("Adding category is successful.");
    }
    else
    { alert("Adding category is failed.");}
  }
}
