import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomerComponent } from './home-page/admin/customer/add-customer/add-customer.component';
import { CustomerListComponent } from './home-page/admin/customer/customer-list/customer-list.component';
import { AddroleComponent } from './home-page/admin/role/addrole/addrole.component';
import { ListRoleComponent } from './home-page/admin/role/list-role/list-role.component';
import { UpdateRoleComponent } from './home-page/admin/role/update-role/update-role.component';

const routes: Routes = [
  { path: 'customer/edit/:customerId', component: AddCustomerComponent }, // For update
  { path: 'customer/add', component: AddCustomerComponent },
  { path: 'customer', component: CustomerListComponent},
  { path: 'addrole', component: AddroleComponent},
  { path: 'listrole', component: ListRoleComponent},
  { path: 'role/edit/:id', component: UpdateRoleComponent}, // For update

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
