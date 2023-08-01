import { Pipe, PipeTransform } from '@angular/core';
import { CategoryService } from '../Services/categoryService/category.service';

@Pipe({
  name: 'categoryName',
  standalone: true,
})
export class CategoryNamePipe implements PipeTransform {
  constructor(private categoryService: CategoryService) {} // Update with your service

  transform(value: number, ...args: unknown[]): string {
    const categoryName: string = this.categoryService.getCategoryNameById(value);
    return categoryName ? categoryName : 'Unknown Category';
  }

}
