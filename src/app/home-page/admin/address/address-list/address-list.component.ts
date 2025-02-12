import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddressService } from '../address.service';
import { Address } from '../address.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAllAddresses } from '../store/address.selector';
import { loadAllAddresses } from '../store/address.action';
import { environment } from 'environments/environment.development';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss'
})
export class AddressListComponent {
  displayedColumns:string[] = environment.addressListDisplayedColumns;
  
  selectedRows:Set<Address> = new Set();

  addresses$!:Observable<Address[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  public dataSource = new MatTableDataSource<Address>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _liveAnnouncer : LiveAnnouncer,private addressService:AddressService,
    private router:Router, private store:Store
  ){
    this.addresses$ = this.store.select(selectAllAddresses);
  }

  ngOnInit(){
    // this.loadAllAddresses();
    
    this.store.dispatch(loadAllAddresses());

    this.addresses$.subscribe(addresses => {
      console.log(addresses);
      this.dataSource.data = addresses;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // loadAllAddresses(){
  //   this.addressService.getAllAddresses().subscribe(
  //     (addresses: Address[]) => {
  //       this.dataSource.data = addresses;
  //     },
  //     (error) => {
  //       console.error('Error fetching addresses', error);
  //     }
  //   );
  // }

  toggleRowSelection(row: Address) {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row); // Unselect the row
    } else {
      this.selectedRows.add(row); // Select the row
    }
  }

  selectAllRows(event: any) {
    if (event.checked) {
      this.selectedRows = new Set(this.dataSource.data);
    } else {

      this.selectedRows.clear();
    }
  }


  isRowSelected(row: Address): boolean {
    return this.selectedRows.has(row);
  }


  isBulkEditActive(): boolean {
    return this.selectedRows.size > 0;
  }

  editAddress(id: string) {
    if (this.isBulkEditActive()) return;
    this.router.navigate(['/address/edit/', id]);
  }

  deleteAddress(id: string) {
    if (this.isBulkEditActive()) return;
    this.addressService.deleteAddressById(id).subscribe(() => {
      alert("Address deleted successfully");
    }).add(() => {
      // this.loadAllAddresses();
      // this.store.dispatch(loadAllAddresses());
    });
  }

  editBulkAddress() {
    if (this.selectedRows.size === 0) {
      alert("Please select at least one address to bulk edit.");
      return;
    }
    this.router.navigate(['/address/bulk-edit'], { state: { selectedAddresses: Array.from(this.selectedRows) } });
  }
  


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    this.dataSource.filterPredicate = (data: Address, filter: string) => {
      return (data.addressLine1 ? data.addressLine1.toLowerCase() : '').includes(filter) ||
             (data.addressLine2 ? data.addressLine2.toLowerCase() : '').includes(filter) ||
             (data.city ? data.city.toLowerCase() : '').includes(filter) ||
             (data.district ? data.district.toLowerCase() : '').includes(filter);
    };
  }
  


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


}
