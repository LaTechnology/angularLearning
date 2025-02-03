import { Customer } from "../customer.model";

export interface CustomerState {
    customers: Customer[];
    loading: boolean;
    error: string | null;
  }
  
  export const initialState: CustomerState = {
    customers: [],
    loading: false,
    error: null
  };