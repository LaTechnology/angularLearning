import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomerComponent } from './home-page/admin/customer/add-customer/add-customer.component';
import { CustomerListComponent } from './home-page/admin/customer/customer-list/customer-list.component';
import { CreateAddressComponent } from './home-page/admin/address/create-address/create-address.component';
import { AddressListComponent } from './home-page/admin/address/address-list/address-list.component';

const routes: Routes = [
  { path: 'customer/edit/:customerId', component: AddCustomerComponent }, // For update
  { path: 'customer/add', component: AddCustomerComponent },
  { path: 'customer', component: CustomerListComponent},
  {path: 'address/add', component:CreateAddressComponent},
  {path: 'address/edit/:id', component:CreateAddressComponent},
  {path:'address/list',component:AddressListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
