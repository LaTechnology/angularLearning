import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientLandingComponent } from './client-landing/client-landing.component';
import { ClientAddFormComponent } from './client-landing/client-add-form/client-add-form.component';
import { ClientComponent } from './client.component';
import { TemplateModule } from 'app/template/template.module';
import { ModelPopupModule } from 'app/model-popup/model-popup.module';


@NgModule({
  declarations: [
    ClientLandingComponent,
    ClientAddFormComponent,
    ClientComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
     TemplateModule,
    ModelPopupModule
  ]
})
export class ClientModule { }
