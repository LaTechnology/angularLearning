import { Inject, Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // private customers: Customer[] = [];

  // // constructor() {
  // //   this.loadCustomers(); // Load from file on startup
  // // }

  // constructor() {}

 
  // addCustomer(customer: Customer) {
  //   this.customers.push(customer);
  //   console.log("this.customer",this.customers)
  //   this.saveToFile();
  // }

  // // getCustomers(): Customer[] {
  // //   return this.customers;
  // // }

  // // getCustomerById(id: string): Customer | undefined {
  // //   return this.customers.find(c => c.customerId === id);
  // // }

  // getCustomers(): Customer[] {
  //   const customers = localStorage.getItem('customers');
  //   if (customers) {
  //     console.log('Loaded customers from localStorage:', JSON.parse(customers));
  //     return JSON.parse(customers);  
  //   } else {
  //     console.log('No customers found in localStorage.');
  //     return []; 
  //   }
  // }
  
  // getCustomerById(id: string): Customer | undefined {
  //   const customers = this.getCustomers();  
  //   return customers.find(c => c.customerId === id); 
  // }

  // // updateCustomer(updatedCustomer: Customer) {
  // //   console.log('Updating customer:', updatedCustomer);  
  // //   const index = this.customers.findIndex(c => c.customerId === updatedCustomer.customerId);
  // //   if (index !== -1) {
  // //     this.customers[index] = updatedCustomer;
  // //     this.saveToFile();
  // //   } else {
  // //     console.log('Customer not found!');
  // //   }
  // // }

  // updateCustomer(updatedCustomer: Customer) {
  //   const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
  //   console.log('Updating customer:', updatedCustomer);  
  
  //   console.log("update",updatedCustomer.customerId)
  //   console.log("exiting customer",existingCustomers)
  //   const index = existingCustomers.findIndex((c: { customerId: string; })  => c.customerId === updatedCustomer.customerId);
  //   console.log("index"+ index)
  //   if (index !== -1) {
  //     existingCustomers[index] = updatedCustomer;
  //     localStorage.setItem('customers', JSON.stringify(updatedCustomer));
  //     console.log('Customer updated successfully:', this.customers);
  //   } else {
  //     console.log('Customer not found!');
  //   }
  // }
  

  // private saveToFile() {
  //   const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    
  //  localStorage.setItem('customers', JSON.stringify(existingCustomers));
  // }
  
  private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    console.log("customer",customer)
    return this.http.post<Customer>(this.apiUrl, customer);
  }
  getCustomerById(customerId: string) {
    return this.http.get<Customer>(`http://localhost:3000/customers/${customerId}`);
  }
  
    
  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customer.id}`, customer);
  }
  deleteCustomer(customerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customerId}`);
  }
  }
  // private loadCustomers() {
  //   const data = localStorage.getItem('customers');
  //   if (data) {
  //     this.customers = JSON.parse(data);
  //   }
  // }

