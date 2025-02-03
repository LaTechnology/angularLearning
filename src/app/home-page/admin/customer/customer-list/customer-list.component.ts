import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllCustomers } from '../store/customer.selector';
import { loadCustomers } from '../store/customer.action';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'actions'];
    dataSource = new MatTableDataSource<Customer>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  customers$!: Observable<Customer[]>;
  constructor( private router: Router,private store: Store) {
    this.customers$ = this.store.select(selectAllCustomers);
  }

  ngOnInit() {
    this.store.dispatch(loadCustomers());

    // Subscribe to customer changes and update the table
    this.customers$.subscribe(customers => {
      this.dataSource.data = customers;
    });
    }

  // loadCustomers() {
  //   this.dataSource.data = this.customerService.getCustomers();
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  // }

  editCustomer(customerId: string) {
    this.router.navigate(['/addcustomer', customerId]);
    console.log(customerId)
  }

 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
