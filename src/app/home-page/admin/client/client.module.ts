import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientAddFormComponent } from './client-add-form/client-add-form.component';
import { ClientComponent } from './client.component';
import { TemplateModule } from 'app/template/template.module';
import { ModelPopupModule } from 'app/model-popup/model-popup.module';


@NgModule({
  declarations: [
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
