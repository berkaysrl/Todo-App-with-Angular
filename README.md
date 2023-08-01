# TODO App - ICRON Assignment - Cevdet Berkay Sarialioglu
This project was generated with Angular CLI and is designed to showcase practical Angular functionality with CRUD operations, RXJS, and Reactive Programming skills.

## Features
### Category Management

* Add a new category.
* Edit existing categories.
* Remove categories.
* View a list of all categories.

### Todo Management

* Add new Todo items associated with categories.
* Edit existing Todo items.
* Remove Todo items.
* View a list of all Todo items.
* Filter Todo items based on category and text search.

## Technical Specifications
* Single Responsibility Principle (SRP): The codebase is written adhering to the Single Responsibility Principle ensuring each module or class has responsibility over a single part of the functionality.

* Singleton Services: All services are designed as singletons ensuring a single instance of the service throughout the application. This allows for efficient data sharing and management across components.

* Standalone Components: Components in this project are designed to function as standalone entities. This ensures better maintainability and reusability.*

* Lazy Loading: The application leverages Angular's lazy loading feature for routing. This helps in loading only the necessary modules thereby optimizing the application's performance.

* Page Routing: Implemented lazy loading for routing.

* Data Storage: Uses local storage to persist category and Todo item data.

* Services: Data communication happens through single-instance injectable service functions. Changes are reflected using Behavior Subjects and synchronized with observable lists.

* Components: Components function as standalone entities. Data lists in HTML utilize the async pipe.

* Reactive Forms: Angular's Reactive Forms are used for adding and managing categories and Todo items.

* Filtering: Especially uses the combineLatest operator for filtering functionalities.

* Styling: Uses Bootstrap 5. Layouts are constructed using the bootstrap flex structure.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
