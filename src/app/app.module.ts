import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import { InventoryComponent } from './home-page/inventory/inventory.component';
import { OrdersComponent } from './home-page/orders/orders.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CustomerListComponent } from './home-page/admin/customer/customer-list/customer-list.component';
import { AddCustomerComponent } from './home-page/admin/customer/add-customer/add-customer.component';
import { CommonModule } from '@angular/common';
import { CustomerModule } from './home-page/admin/customer/customer.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { customerReducer } from './home-page/admin/customer/store/customer.reducer';
import { CustomerEffects } from './home-page/admin/customer/store/customer.effects';
import { CreateAddressComponent } from './home-page/admin/address/create-address/create-address.component';
import { AddressListComponent } from './home-page/admin/address/address-list/address-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    InventoryComponent,
    OrdersComponent,
    CustomerListComponent,
    AddCustomerComponent,
    CreateAddressComponent,
    AddressListComponent
  ],
  imports: [
    CustomerModule,
    // AddressModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatTabsModule,
    MatFormFieldModule,
     MatSelectModule,
      MatInputModule,
       FormsModule,
      CommonModule,
     FormsModule,
     ReactiveFormsModule,
     MatInputModule,
     MatDatepickerModule,
     MatNativeDateModule,
     MatCardModule,
     MatTableModule,
     MatSortModule,
     MatPaginatorModule,
     MatButtonModule,
     MatIconModule,
     HttpClientModule,
     StoreModule.forRoot({customers: customerReducer}),
     EffectsModule.forRoot([CustomerEffects]),
     StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
     
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    MatDatepickerModule,
    provideHttpClient(withFetch()),
    provideAnimationsAsync('noop')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
