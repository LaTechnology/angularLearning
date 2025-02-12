import { Injectable } from '@angular/core';
import { Customer } from './customer.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'environments/environment.development';
import { ApiService } from 'app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = `${environment.apiUrl}/customers`
 // private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient,private apiService : ApiService) {}

  getCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(this.apiUrl);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.apiService.post<Customer>(this.apiUrl, customer);
  }
 
  updateCustomer(customer: Customer): Observable<Customer> {
    return this.apiService.put<Customer>(`${this.apiUrl}/${customer.id}`, customer);
  }
  deleteCustomer(customerId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.apiUrl}/${customerId}`);
  }


  updateCustomersBulk(customers: Customer[]): Observable<Customer[]> {
    const updateRequests = customers.map((customer) => this.updateCustomer(customer));
    return forkJoin(updateRequests);
  }
  }


//  private apiUrl = `${environment.apiUrl}/products`;

//   constructor(private apiService: ApiService) {}

//   getProducts(): Observable<Product[]> {
//     return this.apiService.get<Product[]>(this.apiUrl);
//   }