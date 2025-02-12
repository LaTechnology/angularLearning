import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { CustomerListComponent } from '../customer-list/customer-list.component';
import { AuthGuard } from 'app/guards/auth.guard';

const routes: Routes = [{ path: '', component: CustomerComponent ,
  children:[
 { path: 'edit/:customerId', component: AddCustomerComponent, canActivate: [AuthGuard] },
    { path: 'add', component: AddCustomerComponent, canActivate: [AuthGuard] },
    { path: 'list', component: CustomerListComponent, canActivate: [AuthGuard] },
      { path: 'edit/bulk', component: AddCustomerComponent, canActivate: [AuthGuard] }, // For update

  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
