import { CommonModule } from "@angular/common";
import { LocationRoutingModule } from "./location-routing.module";
import { TemplateModule } from "app/template/template.module";
import { AddLocationComponent } from "./add-location/add-location.component";
import { EditLocationComponent } from "./edit-location/edit-location.component";
import { LocationListComponent } from "./location-list/location-list.component";
import { NgModule } from "@angular/core";
import { LocationComponent } from "./location.component";
import { LocationBulkEditComponent } from './location-bulk-edit/location-bulk-edit.component';

@NgModule({
    declarations:[
        LocationComponent,
        AddLocationComponent,
        EditLocationComponent,
        LocationListComponent,
        LocationBulkEditComponent
    ],
    imports:[
        LocationRoutingModule,
        CommonModule,
        TemplateModule
    ]
})
export class LocationModule{

}