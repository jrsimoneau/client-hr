import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivateChild } from '@angular/router';
import { AuthGuard } from './user/auth.guard';
import { LoginComponent } from './user/login/login.component';
// import { HomeComponent } from './home.component';

const routes: Routes = [  
  // {
  //   path: 'lazy',
  //   loadChildren: () =>
  //     import('mfe/MFEModule').then((m) => {
  //       return m.LazyModule;
  //     }),
  // },
  {
    path: 'legacy-applications',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./legacy-container/legacy-container.module').then(m => m.LegacyContainerModule)
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
