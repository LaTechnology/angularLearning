import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from 'environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SessionStorageService } from 'app/services/session-storage.service';

declare var bootstrap: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

    displayedColumns: string[] = environment.displayedColumns;
    dataSource = new MatTableDataSource<Product>([]);
    selection = new SelectionModel<Product>(true, []);
    selectedProductId: number | null = null;
    isBulkEditDisabled = true;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    private triggerSubscription!: Subscription;
  
    constructor(private productService: ProductService, private router: Router,public _session: SessionStorageService) {}
  
    ngOnInit(): void {
      this.getAllProduct();
      this.triggerSubscription = this.productService.trigger$.subscribe(() => {
        this.getAllProduct();
        this.selection.clear();
      });
    }

    ngOnDestroy(): void {
      if (this.triggerSubscription) {
        this.triggerSubscription.unsubscribe();
      }
    }

    openAdd(){
      this.router.navigate(['/product/add']);
    }
  
    bulkEdit() {
      const idList = this.selection.selected.map((item: any) => item.id);
      this._session.setItem('productIDList', idList);
      this.router.navigate(['product/bulk-edit']);
    }

    editProduct(product: Product) {
      this._session.setItem('productID', product.id);
      const id = this._session.getItem('productID');
      this.router.navigate([`/product/edit/${id}`]);
    }
  
    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    //selection
    isAllProductSelected(): boolean {
      const check = this.dataSource.data.every((element) =>
        this.selection.selected.includes(element)
      );
      return check;
    }
  
    selectAllProduct() {
      if (this.isAllProductSelected()) {
        this.selection.clear();
        return;
      } else {
        this.dataSource.data.forEach((row: any) =>
          this.selection.select(row)
        );
      }
    }
  
    openDeleteModal(productId: number) {
      this.selectedProductId = productId;
      let modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }
  
    getAllProduct(){
      this.productService.getProducts().subscribe({
        next: (res:any) => {
          this.dataSource.data = res;
        },
        error: (error:HttpErrorResponse) => { },
        complete: () => {}
      });
    }
  
    confirmDelete() {
      if (this.selectedProductId !== null) {
        this.productService.deleteProduct(this.selectedProductId).subscribe({
          next: () => {},
          error: (error:HttpErrorResponse) => {
            alert('Failed to delete the product.');
          },
          complete: () => {
            alert('Product deleted successfully.');
            let modal = bootstrap.Modal.getInstance( document.getElementById('deleteModal') );
            modal.hide();
            this.selectedProductId = null;
            this.getAllProduct();
          }
        });
      }
    }

}
