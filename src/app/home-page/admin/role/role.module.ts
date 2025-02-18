import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleRoutingModule } from './role-routing.module';
import { AddroleComponent } from './addrole/addrole.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { UpdateRoleComponent } from './update-role/update-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { RoleComponent } from './role.component';
import { BulkEditDialogComponent } from './bulk-edit-dialog/bulk-edit-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AddroleComponent,
    ListRoleComponent,
    RoleComponent,
    UpdateRoleComponent,
    DeleteDialogComponent,
    BulkEditDialogComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class RoleModule { }
