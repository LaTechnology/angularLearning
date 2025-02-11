import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from 'environments/environment.development';

declare var bootstrap: any;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = environment.displayedColumns;
  dataSource = new MatTableDataSource<Product>([]);
  selection = new SelectionModel<Product>(true, []);
  selectedProductId: number | null = null;
  isBulkEditDisabled = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.dataSource.data = products;
    });
    this.selection.changed.subscribe(() => {
      this.isBulkEditDisabled = this.selection.selected.length === 0;
    });
  }

  bulkEdit() {
    const selectedIds = this.selection.selected.map(product => product.id);
    if (selectedIds.length > 0) {
      this.router.navigate(['/product/add'], { queryParams: { ids: selectedIds.join(',') } });
    }
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editProduct(product: Product) {
    this.router.navigate(['/product/edit'], { queryParams: { id: product.id } });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isIndeterminate() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleSelectAll(event: any) {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
    } else {
      this.selection.clear();
    }
  }

  toggleSelection(row: Product) {
    this.selection.toggle(row);
  }

  openDeleteModal(productId: number) {
    this.selectedProductId = productId;
    let modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  confirmDelete() {
    if (this.selectedProductId !== null) {
      this.productService.deleteProduct(this.selectedProductId).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(product => product.id !== this.selectedProductId);
          alert('Product deleted successfully.');
          let modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
          modal.hide();
          this.selectedProductId = null;
        },
        error: (error) => {
          alert('Failed to delete the product.');
        }
      });
    }
  }
}
