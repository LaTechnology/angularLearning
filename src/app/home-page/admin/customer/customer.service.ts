import { Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

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
    return this.http.post<Customer>(this.apiUrl, customer);
  }
  getCustomerById(customerId: string) {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`);
  }
    
  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customer.id}`, customer);
  }
  deleteCustomer(customerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customerId}`);
  }


  // updateMultipleCustomers(customers: any[]): Observable<any[]> {
  //   return new Observable(observer => {
  //     let completedRequests = 0;
  //     let updatedCustomers: any[] = [];

  //     customers.forEach(customer => {
  //       this.updateCustomer( customer).subscribe(response => {
  //         updatedCustomers.push(response);
  //         completedRequests++;

  //         if (completedRequests === customers.length) {
  //           observer.next(updatedCustomers);
  //           observer.complete();
  //         }
  //       });
  //     });
  //   });
  // }

  updateCustomersBulk(customers: Customer[]): Observable<Customer[]> {
    const updateRequests = customers.map((customer) => this.updateCustomer(customer));
    return forkJoin(updateRequests);
  }
  }


