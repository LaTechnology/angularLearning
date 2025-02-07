import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomerComponent } from './home-page/admin/customer/add-customer/add-customer.component';
import { CustomerListComponent } from './home-page/admin/customer/customer-list/customer-list.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductListComponent } from './home-page/admin/product/product-list/product-list.component';
import { AddProductComponent } from './home-page/admin/product/add-product/add-product.component';
import { CreateAddressComponent } from './home-page/admin/address/create-address/create-address.component';
import { AddressListComponent } from './home-page/admin/address/address-list/address-list.component';
import { InventoryComponent } from './home-page/inventory/inventory.component';
import { OrdersComponent } from './home-page/orders/orders.component';

const routes: Routes = [
    { path: 'customer/edit/:customerId', component: AddCustomerComponent, canActivate: [AuthGuard] },
    { path: 'customer/add', component: AddCustomerComponent, canActivate: [AuthGuard] },
    { path: 'customer', component: CustomerListComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
    { path: 'product/add', component: AddProductComponent, canActivate: [AuthGuard] },
    { path: 'product/edit', component: AddProductComponent, canActivate: [AuthGuard] },
    { path: 'address/add', component: CreateAddressComponent, canActivate: [AuthGuard] },
    { path: 'address/edit/:id', component: CreateAddressComponent, canActivate: [AuthGuard] },
    { path: 'address/list', component: AddressListComponent, canActivate: [AuthGuard] },
    { path: 'order', component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'inventory', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
