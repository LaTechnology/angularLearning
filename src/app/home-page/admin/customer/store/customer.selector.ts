import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';

// Feature selector
export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

// Selector for getting customer list
export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state) => state.customers
);

// Selector for errors
export const selectCustomerError = createSelector(
  selectCustomerState,
  (state) => state.error
);


export const selectCustomerById = (id: string) => 
  createSelector(
    selectCustomerState,
    (state) => state.customers ? state.customers.find(customer => customer.id === id) : undefined
  );

  export const selectSelectedCustomerIds = createSelector(
    selectCustomerState,
    (state: CustomerState) => state.selectedCustomerIds
  );