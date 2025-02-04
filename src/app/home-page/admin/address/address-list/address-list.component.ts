import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddressService } from '../address.service';
import { Address } from '../address.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss'
})
export class AddressListComponent {
  displayedColumns:string[] = ["addressLine1","addressLine2","city","district","pincode","state","country","region","landMark","phoneNumber","addressType","actions"];

  public dataSource = new MatTableDataSource<Address>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _liveAnnouncer : LiveAnnouncer,private addressService:AddressService,
    private router:Router
  ){

  }

  ngOnInit(){
    this.loadAllAddresses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAllAddresses(){
    this.addressService.getAllAddresses().subscribe(
      (addresses: Address[]) => {
        this.dataSource.data = addresses;
      },
      (error) => {
        console.error('Error fetching addresses', error);
      }
    );
  }

  editAddress(id:string){
    this.router.navigate(['/address/edit/',id]);
  }

  deleteAddress(id:string){
    this.addressService.deleteAddressById(id).subscribe(()=>{
      alert("address deleted successfully");
    }).add(()=>{
      this.loadAllAddresses();
    });
    
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


}
