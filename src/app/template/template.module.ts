import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../meterial/meterial.module';
import { SnackNotificationComponent } from './snack-notification/snack-notification.component';
import { TextboxComponent } from './textbox-outline/textbox.component';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { CountryDropdownComponent } from './country-dropdown/country-dropdown.component';
import { CityDropdownComponent } from './city-dropdown copy/city-dropdown.component';
import { StateDropdownComponent } from './state-dropdown/state-dropdown.component';
import { FormHeaderComponent } from './form-header/form-header.component';
import { RightSideSliderComponent } from './right-side-slider/right-side-slider.component';
import { ButtonComponent } from './button/button.component';
import { SubmitButtonComponent } from './submit-button/submit-button.component';
import { BadgesComponent } from './badges/badges.component';
import { ShimmerDataComponent } from './shimmer-data/shimmer-data.component';
import { IconsComponent } from './icons/icons.component';

//package
import { InfiniteScrollModule } from 'ngx-infinite-scroll'; //https://www.npmjs.com/package/ngx-infinite-scroll
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'; //https://ng-bootstrap.github.io/#/components/tooltip/api
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; //https://www.npmjs.com/package/@ng-bootstrap/ng-bootstrap
import { TooltipDirective } from './tooltip.directive';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';

const export_customReusableComponents: Array<Type<unknown>> = [ 
  SnackNotificationComponent,
  TextboxComponent,
  PhoneNumberComponent,
  CountryDropdownComponent,
  CityDropdownComponent,
  StateDropdownComponent,
  FormHeaderComponent,
  RightSideSliderComponent,
  ButtonComponent,
  SubmitButtonComponent,
  BadgesComponent,
  ShimmerDataComponent,
  IconsComponent,
]

const packages = [
  InfiniteScrollModule,
  NgbTooltipModule,
  NgbModule,
  NgxMatIntlTelInputComponent
]

const export_materialModules = [
  MaterialModule,
]

const export_directives = [
  TooltipDirective,
]

@NgModule({

  declarations: [
    ...export_directives,
    ...export_customReusableComponents,
  ],

  imports: [
    CommonModule,
    ...packages,
    ...export_materialModules,
  ],

  exports: [
    ...export_materialModules,
    ...packages,
    ...export_customReusableComponents,
    ...export_directives
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class TemplateModule { }
