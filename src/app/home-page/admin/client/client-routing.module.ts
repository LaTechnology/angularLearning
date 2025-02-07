import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLandingComponent } from './client-landing/client-landing.component';
import { ClientComponent } from './client.component';
import { ClientAddFormComponent } from './client-landing/client-add-form/client-add-form.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '', component: ClientLandingComponent },
      { path: 'add', component: ClientAddFormComponent },
      { path: 'edit', component: ClientAddFormComponent },
      { path: 'bulk-upload', component: ClientAddFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
