import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component,  OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  take } from 'rxjs';
import { Category } from 'src/app/Interfaces/ICategory.interface';
import { CategoryService } from 'src/app/Services/categoryService/category.service';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss'],
  standalone:true,
  imports:[
    ReactiveFormsModule,CommonModule,
    NgFor,
    NgIf,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListCategoriesComponent implements OnInit {
    // To check if editing mode is on or off
  categoriesForm: FormGroup;
  categoryTitles: string[] = ["Name", "Operations"];
  // We keep a form to return the value in cancel and reset state.
  initialFormData: any;
  //We can see if there is a change from the comparison between this initial form and the real form and we keep as boolean variable it in this variable.
  hasChanges: boolean = false;
  addCategoryGroup=new FormGroup({
    'id':new FormControl(0),
    'name':new FormControl('',[Validators.required])
  });
  // Getter for 'categories' form array
  get categories(): FormArray {
    return this.categoriesForm.get('categories') as FormArray;
  }
  constructor(
    public categoryService: CategoryService,
    private fb: FormBuilder
  ) { 
    this.categoriesForm = this.fb.group({
      categories: this.fb.array([])
    });
  }
  ngOnInit(): void {
    this.categoryService.getCategories().pipe(take(1)).subscribe(categories => {
      categories.forEach(category => this.categories.push(this.createCategoryGroup(category)));
    });
    this.categoriesForm.valueChanges.subscribe(() => {
      this.hasChanges = JSON.stringify(this.initialFormData) !== JSON.stringify(this.categoriesForm.value);
    });
    this.initialFormData=this.categoriesForm.value;
  }

  // Function to create a FormGroup for a Category
  createCategoryGroup(category?: Category): FormGroup {
    return this.fb.group({
      id: [category?.id || null],
      name: [category?.name || '']
    });
}
  addCategoryRow() {
    if(!this.addCategoryGroup.invalid) {
        const categoryToAdd: Category = {
            id: this.addCategoryGroup.get('id')?.value || 0,
            name: this.addCategoryGroup.get('name')?.value || ''
        };
        const addedCategory = this.categoryService.addCategory(categoryToAdd);
        this.categories.push(this.createCategoryGroup(addedCategory));
        this.addCategoryGroup.reset();
        this.initialFormData=this.categoriesForm.value;
        this.hasChanges=false;
    }
} 
  onSaveAll() {
    const updatedCategories: Category[] = this.categoriesForm.value.categories;
    this.categoryService.updateAllCategories(updatedCategories);
    this.initialFormData=this.categoriesForm.value;
    this.hasChanges=false;
  }
  // Function to delete a todo
  onDelete(index: number,id:number) {
    this.categories.removeAt(index);
    this.categoryService.deleteCategory(id);
  }
   // Function to reset form changes
  resetChanges() {
      this.categoriesForm.reset(this.initialFormData);
  }
  onCancelChanges() {
        this.categoriesForm.reset(this.initialFormData);
  }
}