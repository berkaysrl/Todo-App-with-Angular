import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryListComponent } from './pages/Category/category-list/category-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryAddComponent } from './pages/Category/category-add/category-add.component';
import { NavbarComponent } from './pages/Header/navbar/navbar.component';
import { TodoListComponent } from './pages/Todo/todo-list/todo-list.component';
import { TodoAddComponent } from './pages/Todo/todo-add/todo-add.component';
@NgModule({
  declarations: [
    AppComponent,
    CategoryListComponent,
    CategoryAddComponent,
    NavbarComponent,
    TodoListComponent,
    TodoAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
