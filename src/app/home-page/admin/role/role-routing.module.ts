import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRoleComponent } from './list-role/list-role.component';
import { AddroleComponent } from './addrole/addrole.component';
import { RoleComponent } from './role.component';
import { UpdateRoleComponent } from './update-role/update-role.component';

const routes: Routes = [{
    path: '', component: RoleComponent,
    children: [
      { path: '', component: ListRoleComponent },
      { path: 'addrole', component: AddroleComponent },
      { path: 'edit/:id', component: UpdateRoleComponent }

    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
