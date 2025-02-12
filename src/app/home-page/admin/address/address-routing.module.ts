import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateAddressComponent } from "./create-address/create-address.component";
import { AddressListComponent } from "./address-list/address-list.component";
import { AuthGuard } from "app/guards/auth.guard";
import { AddressBulkEditComponent } from "./address-bulk-edit/address-bulk-edit.component";
import { AddressComponent } from "./address.component";



const routes:Routes = [{
    path:'',component:AddressComponent,
    children:[
        {path:'add',component:CreateAddressComponent,canActivate:[AuthGuard]},
        {path:'edit/:id',component:CreateAddressComponent,canActivate:[AuthGuard]},
        {path:'list',component:AddressListComponent,canActivate:[AuthGuard]},
        {path:'bulk-edit',component:AddressBulkEditComponent,canActivate:[AuthGuard]}
    ]
}]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class AddressRoutingModule{

}