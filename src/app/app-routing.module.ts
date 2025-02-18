import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { InventoryComponent } from './home-page/inventory/inventory.component';
import { OrdersComponent } from './home-page/orders/orders.component';


const routes: Routes = [
  { path: 'order', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
  {
    path: 'product',
    loadChildren: () => import('../app/home-page/admin/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'client',
    loadChildren: () => import('../app/home-page/admin/client/client.module').then((m) => m.ClientModule),
  },
  {
    path: 'customer',
    loadChildren: () => import('./home-page/admin/customer/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'address',
    loadChildren: () => import('../app/home-page/admin/address/address.module').then((m) => m.AddressModule)
  },
  {
    path: 'role',
    loadChildren: () => import('../app/home-page/admin/role/role.module').then((m) => m.RoleModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
