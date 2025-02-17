import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { ClientAddFormComponent } from './client-add-form/client-add-form.component';

const routes: Routes = [
  {
    path: '', component: ClientComponent,
    children: [
      { path: 'add', component: ClientAddFormComponent },
      { path: 'edit/:id', component: ClientAddFormComponent },
      { path: 'bulk-edit', component: ClientAddFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
