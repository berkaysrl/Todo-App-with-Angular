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
  // Form for Categories
  categoriesForm: FormGroup;
  // Column titles for the category table
  categoryTitles: string[] = ["Name", "Operations"];
  // Storing the initial form data for checking unsaved changes
  initialFormData: any;
  // Flag to determine if form has unsaved changes
  hasChanges: boolean = false;
  // Form for adding a new category
  addCategoryGroup=new FormGroup({
    'id':new FormControl(0),
    'name':new FormControl('',[Validators.required])
  });
  // Getter to fetch the 'categories' form array from the form
  get categories(): FormArray {
    return this.categoriesForm.get('categories') as FormArray;
  }
  // Constructor with injected services
  constructor(
    public categoryService: CategoryService,
    private fb: FormBuilder
  ) { 
    this.categoriesForm = this.fb.group({
      categories: this.fb.array([])
    });
  }
  ngOnInit(): void {
    // Fetching all categories on initialization
    this.categoryService.getCategories().pipe(take(1)).subscribe(categories => {
      categories.forEach(category => this.categories.push(this.createCategoryGroup(category)));
    });
    // Checking for changes in the form data
    this.categoriesForm.valueChanges.subscribe(() => {
      this.hasChanges = JSON.stringify(this.initialFormData) !== JSON.stringify(this.categoriesForm.value);
    });
    // Setting the initial form data
    this.categoryService.getCategories().subscribe(category => {
      this.initialFormData=this.categoriesForm.value;
      this.categoriesForm.reset(this.initialFormData);
    });
  }

  // Utility function to create a FormGroup for a category
  createCategoryGroup(category?: Category): FormGroup {
    return this.fb.group({
      id: [category?.id || null],
      name: [category?.name || '']
    });
  }  
  // Function to add a new category
  addCategoryRow() {
    if(!this.addCategoryGroup.invalid) {
        const categoryToAdd: Category = {
            id: this.categoryService.getCategoryId(),
            name: this.addCategoryGroup.get('name')?.value || ''
        };
        this.categories.push(this.createCategoryGroup(categoryToAdd));
        this.categoryService.addCategory(categoryToAdd);
        this.addCategoryGroup.reset();
    }
  }
  // Function to save all changes
  onSaveAll() {
    const changedCategories = this.getChangedCategories();
    if (changedCategories.length > 0) {
      this.categoryService.updateAllCategories(changedCategories);
    }
  }
  // Utility function to get the categories that have been changed
  getChangedCategories(): Category[] {
    const changedTodos: Category[] = [];
    this.categories.controls.forEach(control => {
      if (control instanceof FormGroup && control.dirty) {
        changedTodos.push(control.value);
      }
    });
    return changedTodos;
  }
  // Function to delete a category
  onDelete(index: number,id:number) {
    this.categories.removeAt(index);
    this.categoryService.deleteCategory(id);
  }
  // Function to reset form changes to initial state
  resetChanges() {
      this.categoriesForm.reset(this.initialFormData);
  }

}