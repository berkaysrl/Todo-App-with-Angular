import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/ICategory.interface';
import { CategoryService } from 'src/app/services/Category/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories$ !: Observable<Category[]>;
  tableHeaders: string[] = ["ID", "Name", "Operations"];
  editingId: number | null = null;
  editCategoryControl = new FormControl('');
  constructor(public categoryService: CategoryService) { }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getcategories();
  }
  onEdit(id: number, name: string) {
    this.editingId = id;
    this.editCategoryControl.setValue(name);
  }
  onSave(category: Category) {
    category.name = this.editCategoryControl.value ?this.editCategoryControl.value : '' ;
    this.categoryService.updateCategory(category); // Bu fonksiyonu kendi servisinizde oluşturmanız gerekmekte.
    this.editingId = null;
  }
  onCancel() {
    this.editingId = null;
  }

  onDelete(id: number) {
    this.categoryService.deleteCategory(id);
  }

}
