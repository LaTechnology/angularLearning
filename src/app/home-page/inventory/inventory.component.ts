import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventoryItem } from './inventory.model';
import { ProductService } from '../admin/product/product.service';
import { environment } from 'environments/environment.development';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = environment.inventoryDisplayedColumns;
  dataSource = new MatTableDataSource<InventoryItem>([]);
  locations: { id: string; name: string }[] = [];
  selectedLocationId: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadLocations();
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadLocations() {
    this.productService.getAllLocation().subscribe((locations) => {
      this.locations = locations.map(loc => ({ id: loc.id, name: loc.name }));
  
      if (this.locations.length > 0) {
        this.selectedLocationId = this.locations[0].id;
        this.loadProducts();
      }
    });
  }
  
  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      if (this.selectedLocationId) {
        products = products.filter(product =>
          product.locations.some(loc => loc.id === this.selectedLocationId)
        );
      }
  
      this.dataSource.data = products.map(product => ({
        name: product.productName,
        size: product.size,
        brand: product.brand,
        color: product.color,
        code: product.code,
        quantity: product.quantity,
        location: product.locations.map(loc => loc.name).join(', ')
      }));
    });
  }

  onLocationChange(selectedLocationId: string) {
    this.selectedLocationId = selectedLocationId;
    this.loadProducts();
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
