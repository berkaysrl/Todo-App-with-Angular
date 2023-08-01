import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/ICategory.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  private categories$ = this.categoriesSubject.asObservable();
  private categoryIdCounter = 1; // ID için basit bir sayaç
  constructor() { 
    this.loadInitialData();
  }
  private loadInitialData() {
    const storedcategories = localStorage.getItem('categories');
    if (storedcategories) {
      const categories = JSON.parse(storedcategories);
      this.categoriesSubject.next(categories);
      // Sayaç olarak en son eklenen kullanıcının ID'sini kullan
      this.categoryIdCounter = categories.length > 0 ? categories[categories.length - 1].id + 1 : 1;
    }
  }
  public getcategories(): Observable<Category[]> {
    return this.categories$;
  }
  //Question
  addCategory(category: Category): void {
    const newUser = {name:category.name, id: this.categoryIdCounter++ }; // Yeni bir ID ile kullanıcıyı genişlet
    const currentcategories = this.categoriesSubject.value;
    const updatedcategories = [...currentcategories, newUser];
    this.categoriesSubject.next(updatedcategories);
    localStorage.setItem('categories', JSON.stringify(updatedcategories));
  }

  deleteCategory(categoryId: number): void {
    const currentcategories = this.categoriesSubject.value;
    const updatedcategories = currentcategories.filter(category => category.id !== categoryId); // ID'ye göre kullanıcıyı filtrele
    this.categoriesSubject.next(updatedcategories);
    localStorage.setItem('categories', JSON.stringify(updatedcategories));
  }
  updateCategory(updatedCategory: Category): void {
    const currentCategories = this.categoriesSubject.value;
    // ID'ye göre kategoriyi bul ve güncelle
    const index = currentCategories.findIndex(category => category.id === updatedCategory.id);
    if (index !== -1) {
      currentCategories[index] = updatedCategory;
      this.categoriesSubject.next(currentCategories);
      localStorage.setItem('categories', JSON.stringify(currentCategories));
    } else {
      console.error('Kategori bulunamadı!');
    }
}
  getCategoryNameById(id: number): string {
    const currentcategories = this.categoriesSubject.value;
    const selectedCategory = currentcategories.find(category => category.id === id);
    return selectedCategory ? selectedCategory.name : 'Unknown Category';
  }
}
