import { RouterModule, Routes } from "@angular/router";
import { LocationComponent } from "./location.component";
import { AddLocationComponent } from "./add-location/add-location.component";
import { EditLocationComponent } from "./edit-location/edit-location.component";
import { LocationListComponent } from "./location-list/location-list.component";
import { AuthGuard } from "app/guards/auth.guard";
import { NgModule } from "@angular/core";


const routes:Routes = [{
    path:'',component:LocationComponent,
    children:[
        {path:'add',component:AddLocationComponent,canActivate:[AuthGuard]},
        {path:'edit/:id',component:EditLocationComponent,canActivate:[AuthGuard]},
        {path:'list',component:LocationListComponent,canActivate:[AuthGuard]},
        // {path:'bulk-edit',component:LocationBulkEditComponent,canActivate:[AuthGuard]}
    ]
}]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class LocationRoutingModule{

}