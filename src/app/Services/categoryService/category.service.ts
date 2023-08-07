import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Category } from 'src/app/Interfaces/ICategory.interface';
import { StorageService } from '../storageService/storage.service';

@Injectable({
  providedIn: 'root' // This service will be provided at the root level, making it a singleton across the app
})
export class CategoryService {
 // BehaviorSubject that holds the current list of categories
 private categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
 // Observable version of the BehaviorSubject
 private categories$ = this.categoriesSubject.asObservable();
 // Auto-incrementing ID value to be used when adding a new category
 private categoryIdCounter = 1;
 constructor(private storageService: StorageService) {
   this.loadInitialData();
 }
 // Function to load category data from storage at startup
 private loadInitialData() {
   const storedCategories = this.storageService.get('categories');
   if (storedCategories) {
     this.categoriesSubject.next(storedCategories);
     this.categoryIdCounter = storedCategories.length > 0 ? storedCategories[storedCategories.length - 1].id + 1 : 1;
   }
 }
 // Function that returns the list of categories
 public getCategories(): Observable<Category[]> {
   return this.categories$;
 }
 // Function to add a new category
 addCategory(category: Category): Category {
  const newCategory = {name:category.name, id: this.categoryIdCounter++ };
  const currentCategories = this.categoriesSubject.value;
  const updatedCategories = [...currentCategories, newCategory];
  this.categoriesSubject.next(updatedCategories);
  this.storageService.set('categories', updatedCategories);
  return newCategory;  // Eklenen yeni kategoriyi döndürün
}
 // Function to delete an existing category
 deleteCategory(categoryId: number): void {
   const currentCategories = this.categoriesSubject.value;
   const updatedCategories = currentCategories.filter(category => category.id !== categoryId);
   this.categoriesSubject.next(updatedCategories);
   this.storageService.set('categories', updatedCategories);
 }
 // Function to fetch category name by its ID
 getCategoryNameById(id: number): string {
   const currentCategories = this.categoriesSubject.value;
   const selectedCategory = currentCategories.find(category => category.id === id);
   return selectedCategory ? selectedCategory.name : 'Unknown Category';
 }
 updateAllCategories(updatedCategories: Category[]): void {
  // Mevcut kategorileri direkt olarak güncellenen kategorilerle değiştirin
  this.categoriesSubject.next([...updatedCategories]);
  this.storageService.set('categories', updatedCategories);
}

}
