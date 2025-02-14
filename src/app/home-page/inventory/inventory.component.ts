import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventoryItem } from '../inventory/inventory.model';
import { environment } from 'environments/environment.development';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements AfterViewInit {
  displayedColumns: string[] = environment.inventoryDisplayedColumns;

  inventory: InventoryItem[] = [
    { name: 'Item A', size: "M", brand: "PUMA", color: "RED", quantity: 10, code: 'RE123', location: 'Chennai' },
    { name: 'Item B', size: "M", brand: "PUMA", color: "RED", quantity: 20, code: 'PUMA12', location: 'Bangalore' },
    { name: 'Item C', size: "L", brand: "Nike", color: "Blue", quantity: 15, code: 'NIKE3', location: 'Chennai' },
    { name: 'Item D', size: "S", brand: "Adidas", color: "Green", quantity: 5, code: '12345', location: 'Hyderabad' },
  ];

  dataSource = new MatTableDataSource<InventoryItem>(this.inventory);
  locations: string[] = ['Chennai', 'Bangalore', 'Hyderabad'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onLocationChange(selectedLocation: string) {
    this.dataSource.data = this.inventory.filter(item => item.location === selectedLocation);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
