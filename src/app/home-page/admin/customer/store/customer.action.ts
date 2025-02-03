import { createAction, props } from '@ngrx/store';
import { Customer } from '../customer.model';

export const loadCustomers = createAction('[Customer] Load Customers');
export const loadCustomersSuccess = createAction(
  '[Customer] Load Customers Success',
  props<{ customers: Customer[] }>()
);
export const loadCustomersFailure = createAction(
  '[Customer] Load Customers Failure',
  props<{ error: string }>()
);

// Add Customer to API
export const addCustomer = createAction(
  '[Customer] Add Customer',
  props<{ customer: Customer }>()
);
export const addCustomerSuccess = createAction(
  '[Customer] Add Customer Success',
  props<{ customer: Customer }>()
);
export const addCustomerFailure = createAction(
  '[Customer] Add Customer Failure',
  props<{ error: string }>()
);

// Update Customer
export const updateCustomer = createAction(
  '[Customer] Update Customer',
  props<{ customer: Customer }>()
);

export const updateCustomerSuccess = createAction(
  '[Customer] Update Customer Success',
  props<{ customer: Customer }>()
);

export const updateCustomerFailure = createAction(
  '[Customer] Update Customer Failure',
  props<{ error: string }>()
);

//getcustomebyid
export const loadCustomerById = createAction(
  '[Customer] Load Customer By ID',
  props<{ customerId: string }>()
);

export const loadCustomerByIdSuccess = createAction(
  '[Customer] Load Customer By ID Success',
  props<{ customer: Customer }>()
);

export const loadCustomerByIdFailure = createAction(
  '[Customer] Load Customer By ID Failure',
  props<{ error: string }>()
);