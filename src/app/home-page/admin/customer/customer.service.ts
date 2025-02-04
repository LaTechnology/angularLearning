import { Inject, Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

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

