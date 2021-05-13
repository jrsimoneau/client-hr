import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LegacyContainerComponent } from './legacy-container.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: LegacyContainerComponent
      }
    ])
  ],
  declarations: [
    LegacyContainerComponent
  ]
})
export class LegacyContainerModule {}