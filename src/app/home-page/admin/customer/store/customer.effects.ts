import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as CustomerAction from './customer.action';
import { CustomerService } from '../customer.service';


@Injectable()
export class CustomerEffects {
  constructor(private actions$: Actions, private customerService: CustomerService) {}

  // Effect to load customers from API
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.loadCustomers),
      mergeMap(() =>
        this.customerService.getCustomers().pipe(
          map(customers => CustomerAction.loadCustomersSuccess({ customers })),
          catchError(error => of(CustomerAction.loadCustomersFailure({ error: error.message })))
        )
      )
    )
  );

  // Effect to add customer to API
  addCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.addCustomer),
      mergeMap(action =>
       
        this.customerService.addCustomer(action.customer).pipe(
          map(customer => CustomerAction.addCustomerSuccess({ customer })),
          catchError(error => of(CustomerAction.addCustomerFailure({ error: error.message })))
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAction.updateCustomer),
      mergeMap((action) =>
        this.customerService.updateCustomer(action.customer).pipe(
          map((updatedCustomer) =>
            CustomerAction.updateCustomerSuccess({ customer: updatedCustomer })
          ),
          catchError((error) =>
            of(CustomerAction.updateCustomerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  //geCustomerById
  loadCustomerById$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerAction.loadCustomerById),
    mergeMap(action =>
      this.customerService.getCustomerById(action.customerId).pipe(
        map(customer => CustomerAction.loadCustomerByIdSuccess({ customer })),
        catchError( (error) => 
          of(CustomerAction.loadCustomerByIdFailure({ error: error.message }))
      )
    )
  )))
}
