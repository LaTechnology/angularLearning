import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAllCustomers } from '../store/customer.selector';
import { deleteCustomer, loadCustomers } from '../store/customer.action';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { ConfirmDialogComponent } from '../../../dialog/confirm-dialog/confirm-dialog.component';
import { BulkEditComponent } from '../../../dialog/bulk-edit/bulk-edit.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit ,AfterViewInit{
  displayedColumns: string[] = ['select','firstName', 'lastName', 'email', 'phoneNumber', 'actions'];
    dataSource = new MatTableDataSource<Customer>([]);
    customers: any[] = [];
    selectedCustomers: any[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  noDataFound: boolean = false;

  customers$!: Observable<Customer[]>;
  constructor(private _liveAnnouncer: LiveAnnouncer, private router: Router,private store: Store,private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.customers$ = this.store.select(selectAllCustomers);
  }

  ngOnInit() {
    this.store.dispatch(loadCustomers());

    this.customers$.subscribe(customers => {
      this.dataSource.data = customers;
      this.customers = customers;
    });
  }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  editCustomer(customerId: string) {
    this.router.navigate(['customer/edit', customerId]);
    console.log(customerId)
  }

  bulkEdit() {
    const selectedCustomerIds = this.selectedCustomers.map(customer => customer.id).join(',');
    this.router.navigate(['customer/bulkedit'], { queryParams: { selectedCustomers: selectedCustomerIds } });
    }
  

  // openBulkEditDialog() {
  //   if (this.selectedCustomers.length === 0) return;

  //   const dialogRef = this.dialog.open(BulkEditComponent, {
  //     width: '400px',
  //     data: this.selectedCustomers
  //   });

  //   dialogRef.afterClosed().subscribe(updatedCustomers => {
  //     if (updatedCustomers) {
  //       this.store.dispatch(loadCustomers())
  //     }
  //   });
  // }

 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.noDataFound = this.dataSource.filteredData.length === 0;
  }

  confirmDelete(customerId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(deleteCustomer({ id: customerId }));
        this.snackBar.open('Customer deleted successfully', 'Close', { duration: 3000 });
      }
    });
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  toggleSelection(customer: any) {
    const index = this.selectedCustomers.findIndex(c => c.id === customer.id);
    if (index >= 0) {
      this.selectedCustomers.splice(index, 1); 
    } else {
      this.selectedCustomers.push(customer); 
    }
  }
  
  toggleAllSelection(selectAll: boolean) {
    console.log(selectAll, ...this.customers)
    if (selectAll) {
      this.selectedCustomers = [...this.customers]; 
    } else {
      this.selectedCustomers = []; 
    }
  }
  
  
  isAllSelected(): boolean {
    return this.customers.length > 0 && this.selectedCustomers.length === this.customers.length;
  }
  
  
  isIndeterminate(): boolean {
    return this.selectedCustomers.length > 0 && this.selectedCustomers.length < this.customers.length;
  }
  
}
