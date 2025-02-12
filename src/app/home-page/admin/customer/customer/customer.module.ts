import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { MaterialModule } from 'app/meterial/meterial.module';


@NgModule({
  declarations: [
    CustomerComponent,
     CustomerListComponent,
        AddCustomerComponent        
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule
  ]
})
export class CustomerModule { }
