import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Category } from 'src/app/Interfaces/ICategory.interface';
import { StorageService } from '../storageService/storage.service';

@Injectable({
  providedIn: 'root' // This service will be provided at the root level, making it a singleton across the app
})
export class CategoryService {

  // A BehaviorSubject to maintain the current list of categories.
  private categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  // An observable to allow other components to subscribe and get the list of categories.
  private categories$ = this.categoriesSubject.asObservable();
  // A counter for generating unique IDs for new categories.
  private categoryIdCounter = 1;

 constructor(private storageService: StorageService) {
    // Load the initial category data from local storage when the service is instantiated.
   this.loadInitialData();
 }

  // Method to load initial categories from local storage.
 private loadInitialData() {
   const storedCategories = this.storageService.get('categories');
   if (storedCategories) {
     this.categoriesSubject.next(storedCategories);
     // Determine the next available ID based on the last category's ID or start from 1 if no categories are present.
     this.categoryIdCounter = storedCategories.length > 0 ? storedCategories[storedCategories.length - 1].id + 1 : 1;
   }
 }

 // Method to get the next available category ID.
 public getCategoryId():number
 {
   return this.categoryIdCounter;
 }

// Method to retrieve the current list of categories.
 public getCategories(): Observable<Category[]> {
   return this.categories$;
  }

  // Method to add a new category.
  addCategory(category: Category) {
  const newCategory = {name:category.name, id: this.categoryIdCounter++ };
  const currentCategories = this.categoriesSubject.value;
  const updatedCategories = [...currentCategories, newCategory];
  this.categoriesSubject.next(updatedCategories);
  // Store the updated category list in local storage.
  this.storageService.set('categories', updatedCategories);
}
  // Method to delete a category by its ID.
deleteCategory(categoryId: number): void {
   const currentCategories = this.categoriesSubject.value;
   const updatedCategories = currentCategories.filter(category => category.id !== categoryId);
   this.categoriesSubject.next(updatedCategories);
    // Update the local storage with the new category list.
   this.storageService.set('categories', updatedCategories);
 }

  // Method to get the name of a category by its ID.
  getCategoryNameById(id: number): string {
   const currentCategories = this.categoriesSubject.value;
   const selectedCategory = currentCategories.find(category => category.id === id);
   return selectedCategory ? selectedCategory.name : 'Unknown Category';
 }

  // Method to update multiple categories at once.
 updateAllCategories(updatedCategories: Category[]): void {
  const currentCategories = this.categoriesSubject.value;
  updatedCategories.forEach(
   category=>
   {
     const index=currentCategories.findIndex(x=>x.id===category.id);
     console.log(index);
     if (index !== -1) { 
      currentCategories[index] = category;
     }
   }
 )
this.categoriesSubject.next(currentCategories);
// Store the updated category list in local storage.
this.storageService.set('categories', currentCategories); 
}
}
