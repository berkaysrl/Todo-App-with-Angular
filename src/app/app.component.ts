import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './Modules/Navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone:true,
  imports:[
    RouterModule,
    NavbarComponent
  ]
})
export class AppComponent {
  title = 'TodoApp';
}
