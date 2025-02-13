import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectAllCustomers,
  selectCustomerById,
  selectSelectedCustomerIds,
} from '../store/customer.selector';
import {
  deleteCustomer,
  loadCustomers,
  setSelectedCustomerIds,
} from '../store/customer.action';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { ConfirmDialogComponent } from '../../../dialog/confirm-dialog/confirm-dialog.component';
import { BulkEditComponent } from '../../../dialog/bulk-edit/bulk-edit.component';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from 'environments/environment.development';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = environment.customerdisplayedColumns;
  dataSource = new MatTableDataSource<Customer>([]);
  customers: any[] = [];
  selectedCustomers: any[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  noDataFound: boolean = false;

  customers$!: Observable<Customer[]>;

  selection = new SelectionModel<any>(true);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.customers$ = this.store.select(selectAllCustomers);
  }

  ngOnInit() {
    this.store.dispatch(loadCustomers());

    this.customers$.subscribe((customers) => {
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
    console.log(customerId);
  }

  bulkEdit() {
    const selectedCustomerIds = this.selection.selected.map(
      (customer) => customer.id
    );
    if (selectedCustomerIds.length > 0) {
      this.store.dispatch(setSelectedCustomerIds({ selectedCustomerIds }));
      this.router.navigate(['customer/edit/bulk']);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.noDataFound = this.dataSource.filteredData.length === 0;
  }

  confirmDelete(customerId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(deleteCustomer({ id: customerId }));
        this.snackBar.open('Customer deleted successfully', 'Close', {
          duration: 3000,
        });
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
    this.selection.toggle(customer);
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.customers);
    }
  }

  isAllSelected(): boolean {
    return (
      this.customers.length > 0 &&
      this.selection.selected.length === this.customers.length
    );
  }

  isIndeterminate(): boolean {
    return (
      this.selection.selected.length > 0 &&
      this.selection.selected.length < this.customers.length
    );
  }

  isSelected(customer: any): boolean {
    return this.selection.isSelected(customer);
  }
}
