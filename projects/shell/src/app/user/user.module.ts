import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    // RouterModule.forChild([
    //   { path: 'login', component: LoginComponent }
    // ])
  ],
  declarations: [
    LoginComponent
  ]
})
export class UserModule {}