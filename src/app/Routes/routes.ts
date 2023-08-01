import { Routes } from "@angular/router";

export const AppRoute:Routes=[
    {   
         path:"",
         loadComponent : () => import("../Modules/Home/home.component").then(element=>element.HomeComponent),
    },
    {
        path:"todos",
        loadComponent : () => import("../Modules/Todo/Page/todo/todo.component").then(element=>element.TodoComponent)
    },
    {
        path:"categories",
        loadComponent : () => import("../Modules/Category/Pages/category/category.component").then(element=>element.CategoryComponent)
    },
    {   
        path:"**",
        loadComponent : () => import("../Modules/Home/home.component").then(element=>element.HomeComponent),
   }

]