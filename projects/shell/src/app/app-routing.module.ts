import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'lazy',
    loadChildren: () =>
      import('mfe/MFEModule').then((m) => {
        return m.LazyModule;
      }),
  },
  {
    path: 'angular-js',
    loadChildren: () =>
      import('mfe2/MFE2Module').then((m) => {
        return m.simpleApp;
      })
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
