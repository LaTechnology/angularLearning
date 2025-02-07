import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer } from '../home-page/admin/customer/customer.model';
import { CustomerUrl } from '../constants/endpointurl';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private apiService: ApiService) {}

  addCustomer(customer: Customer): Observable<Customer> {
    return this.apiService.post<Customer>(CustomerUrl.create, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.apiService.put<Customer>(CustomerUrl.update(customer.id), customer);
  }

  getCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(CustomerUrl.getAll);
  }

  getCustomerById(customerId: string): Observable<Customer> {
    return this.apiService.get<Customer>(CustomerUrl.getById(customerId));
  }

  deleteCustomer(customerId: string): Observable<void> {
    return this.apiService.delete<void>(CustomerUrl.delete(customerId));
  }
}
