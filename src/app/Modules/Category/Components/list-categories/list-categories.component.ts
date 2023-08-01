import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
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
  ]
})
export class ListCategoriesComponent implements OnDestroy,OnInit {
    private ngUnsubscribe = new Subject<void>();
    // Observable stream to hold list of categories
    categories$ !: Observable<Category[]>;
    // Headers for the category table
    categoryTableHeaders: string[] = ["Name", "Operations"];
     // Holds the ID of the category currently being edited, null if no category is being edited
    editingId: number | null = null;
     // FormControl to manage the editing of category name
    editCategoryControl = new FormControl('');
    constructor(public categoryService: CategoryService) { }
    ngOnInit(): void {
      // Load the categories when component initializes
      this.categories$ = this.categoryService.getCategories().pipe(takeUntil(this.ngUnsubscribe));
    }
    ngOnDestroy(): void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
   // Set the editingId to the id of the category being edited and set the value of editCategoryControl to its name
    onEdit(id: number, name: string) {
      this.editingId = id;
      this.editCategoryControl.setValue(name);
    }
    // Save the updated name of the category and reset editingId to null
    onSave(category: Category) {
      category.name = this.editCategoryControl.value ?this.editCategoryControl.value : '' ;
      this.categoryService.updateCategory(category); 
      this.editingId = null;
    }
    // Cancel the editing mode by setting editingId to null
    onCancel() {
      this.editingId = null;
    }
    // Delete a category by its ID
    onDelete(id: number) {
      this.categoryService.deleteCategory(id);
    }

}
