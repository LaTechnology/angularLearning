export enum CustomerType {
    LoggedIn = 'LoggedIn',
    Anonymous = 'Anonymous',
  }
  
 
  export interface Customer {
    id: string;
    customerId: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    dateOfBirth: string; 
    address: string;
    phoneNumber: string;
    alternativePhoneNumber?: string;
    isActive: boolean;
    customerType: CustomerType;
    gender: string;
  }
  