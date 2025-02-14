import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LocationService } from 'app/services/location.service';  

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

  displayedColumns: string[] = ['select','name', 'billingAddress', 'shippingAddress', 'actions'];
  dataSource = new MatTableDataSource<Location>([]);
  selectedRows:Set<Location> = new Set();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private locationService: LocationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.locationService.getAllLocations().subscribe(locations => {
      this.dataSource.data = locations;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleRowSelection(row: Location) {
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
  
  
    isRowSelected(row: Location): boolean {
      return this.selectedRows.has(row);
    }
  
  
    isBulkEditActive(): boolean {
      return this.selectedRows.size > 0;
    }
  

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
    }
  }

  editLocation(id: string) {
    this.router.navigate([`/location/edit/${id}`]);
  }

  deleteLocation(id: string) {
    // this.locationService.deleteLocation(id).subscribe(() => {
    //   alert('Location deleted successfully');
    //   this.dataSource.data = this.dataSource.data.filter(loc => loc.id !== id); // Remove deleted item from table
    // });
  }
}
