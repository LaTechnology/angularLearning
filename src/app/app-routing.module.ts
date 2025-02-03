import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomerComponent } from './home-page/admin/customer/add-customer/add-customer.component';
import { CustomerListComponent } from './home-page/admin/customer/customer-list/customer-list.component';

const routes: Routes = [
  { path: 'addcustomer/:customerId', component: AddCustomerComponent }, // For update
  { path: 'addcustomer', component: AddCustomerComponent },
  { path: 'customer', component: CustomerListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
