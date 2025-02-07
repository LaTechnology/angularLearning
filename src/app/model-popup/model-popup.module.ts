import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { TemplateModule } from '../template/template.module';
import { SearchComponent } from './search/search.component';
import { Page404Component } from './page404/page404.component';

const popupComponents = [
  ConfirmationPopupComponent,
  SearchComponent,
  Page404Component
]

@NgModule({
  declarations: [
    ...popupComponents
  ],
  imports: [
    CommonModule,
    TemplateModule
  ],
  exports: [
    ...popupComponents
  ]
})

export class ModelPopupModule { }
