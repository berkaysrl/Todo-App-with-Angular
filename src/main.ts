import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from './app/Routes/routes';


/* platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err)); */

bootstrapApplication(AppComponent,{
providers:[
  importProvidersFrom(
    RouterModule.forRoot(AppRoute)
  )
]
})