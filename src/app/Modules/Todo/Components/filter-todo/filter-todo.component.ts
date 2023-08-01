import { AsyncPipe, NgFor } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit,Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Category } from 'src/app/Interfaces/ICategory.interface';
import { CategoryService } from 'src/app/Services/categoryService/category.service';

@Component({
  selector: 'app-filter-todo',
  standalone:true,
  imports:[ReactiveFormsModule,NgFor,AsyncPipe],
  templateUrl: './filter-todo.component.html',
  styleUrls: ['./filter-todo.component.scss']
})
export class FilterTodoComponent implements OnInit,OnDestroy{
  // Output event to communicate search change and category change to the parent component
  @Output() onSearchChange: EventEmitter<string> = new EventEmitter();
  @Output() onCategoryChange: EventEmitter<number> = new EventEmitter();
  //Controls for the changes
  searchControl = new FormControl();
  categoryControl = new FormControl();
  // Observable for list of categories
  categories$ !:Observable<Category[]>;
  private ngUnsubscribe = new Subject<void>();
  // Constructor to inject the required services
  constructor(private categoryService:CategoryService) {
  }
  ngOnInit(): void {
    // Fetch the list of categories on initialization
    this.categories$ = this.categoryService.getCategories().pipe(takeUntil(this.ngUnsubscribe));
    // Subscribe to search input changes and emit the changes
    this.searchControl.valueChanges.subscribe(value => {
      this.onSearchChange.emit(value);
    });
    // Subscribe to category dropdown changes and emit the changes
    this.categoryControl.valueChanges.subscribe(value => {
      this.onCategoryChange.emit(value);
    });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
