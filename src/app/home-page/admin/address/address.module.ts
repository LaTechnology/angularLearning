import { NgModule } from "@angular/core";
import { CreateAddressComponent } from "./create-address/create-address.component";
import { AddressListComponent } from "./address-list/address-list.component";
import { AddressBulkEditComponent } from "./address-bulk-edit/address-bulk-edit.component";
import { TemplateModule } from "app/template/template.module";
import { CommonModule } from "@angular/common";
import { AddressRoutingModule } from "./address-routing.module";
import { AddressComponent } from './address.component';


@NgModule({
    declarations:[
        CreateAddressComponent,
        AddressListComponent,
        AddressBulkEditComponent,
        AddressComponent,
    ],
    imports:[
        AddressRoutingModule,
        CommonModule,
        TemplateModule
    ]
})
export class AddressModule{

}