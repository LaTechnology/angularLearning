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

export const selectCustomerById = (customerId: string) =>
  createSelector(selectCustomerState, (state) => 
    state.customers.find(customer => customer.id === customerId) || undefined
  );