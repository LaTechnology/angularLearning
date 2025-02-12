import { createReducer, on } from '@ngrx/store';
import * as CustomerAction from './customer.action';
import { initialState } from './customer.state';
export const customerReducer = createReducer(
  initialState,

  // Load Customers
  on(CustomerAction.loadCustomersSuccess, (state, { customers }) => ({
    ...state,
    customers,
    loading: false,
    error: null,
  })),
  on(CustomerAction.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Customer
  on(CustomerAction.addCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: [...state.customers, customer],
    loading: false,
    error: null,
  })),
  on(CustomerAction.addCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //Update Customer
  on(CustomerAction.updateCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: state.customers.map((c) =>
      c.id === customer.id ? customer : c
    ),
    loading: false,
  })),
  on(CustomerAction.updateCustomerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  //Delete Customer
  on(CustomerAction.deleteCustomerSuccess, (state, { id }) => ({
    ...state,
    customers: state.customers.filter((customer) => customer.id !== id),
    loading: false,
  })),
  on(CustomerAction.deleteCustomerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),


  //Selected Customer Id's
  on(
    CustomerAction.setSelectedCustomerIds,
    (state, { selectedCustomerIds }) => ({
      ...state,
      selectedCustomerIds,
    })
  )
);
