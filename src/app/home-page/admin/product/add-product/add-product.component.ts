import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { UtilService } from 'app/services/util.service';
import { SessionStorageService } from 'app/services/session-storage.service';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productForm !: FormGroup;
  sizes = ['S', 'M', 'L', 'XL'];
  productSideBarOpen: boolean = false;
  productSidebar: boolean = false;
  headerTittle: string = 'Add New Product';
  saveTittle: string = 'Save';
  bulkSelectedData: any[]=[];
  result: any;

  //popups
  product_submit$: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public _session:SessionStorageService,
    public _util: UtilService,
  ) {}

  ngOnInit() {
      this.initialLoad(this.activatedRoute.snapshot.url[0].path);
    }
  
    initialLoad(productAction: string) {
      this.productSideBarOpen = true;
      this.productSidebar = true;
      this.initiateproductForm();
      if (productAction == 'edit') {
        this.selectedDataApi(this.activatedRoute.snapshot.url[1].path)
        this.headerTittle = 'Update Product';
        this.saveTittle = 'Update';
      }
      if (productAction === 'add') {
        this.headerTittle = 'Add New Product';
        this.saveTittle = 'Save';
      } else if(productAction === 'bulk-edit'){
        this.headerTittle = 'Bulk Update Product';
        this.saveTittle = 'Bulk Update';
        const idList = this._session.getItem('productIDList');
        this.bulkSelectedDataApi(idList);
      }
    }
  
  
    closeRightSidebar() {
      this.productSidebar = false;
      this.productService.triggerSubject.next();
      this.router.navigate(['/product']);
      setTimeout(() => {
        this.productSideBarOpen = false;
        this.product_submit$ = null;
      }, 800);
    }
  
    initiateproductForm() {
      this.productForm = new FormGroup({
        productName: new FormControl('', [ Validators.required]),
        size: new FormControl('', [Validators.required]),
        brand: new FormControl('', [Validators.required]),
        color: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        quantity: new FormControl('',[Validators.required]),
      });
    }
  
    save() {
      this.productForm.markAllAsTouched();
      if (this.productForm.valid) {
        if (this.activatedRoute.snapshot.url[0].path === 'add') {
          this.postproductData(this.productForm.value);
        } else if (this.activatedRoute.snapshot.url[0].path === 'edit') {
          this.updateproductData(this.productForm.value);
        } else if (this.activatedRoute.snapshot.url[0].path === 'bulk-edit'){
          this.bulkUpdateproductData(this.productForm.value);
        }
      }
    }
  
    selectedDataApi(id:any) {
      this.productService?.getProductById(id)?.subscribe( (res: any) => {
          const data = res;
          this.productForm.patchValue(data);
        },
        (err: HttpErrorResponse) => {},
        () => { }
      );
    }
  
    bulkSelectedDataApi(id:any) {
      this.productService?.getSelectedProductById(id)?.subscribe({
        next: (res: any) => {
          this.bulkSelectedData = res;
        },
        error: (err: HttpErrorResponse) => {},
        complete: () => {
          this.result = this.mergeObjectsById(this.bulkSelectedData);
          this.productForm.patchValue(this.result);
        }
      });
    }
  
    mergeObjectsById(objects: any[]): any {
      return objects.reduce((merged, obj) => {
        _.forEach(obj, (value, key) => {
          if (key !== "id") {
           if (!merged.hasOwnProperty(key)) {
            merged[key] = value;
          } else if (!_.isEqual(merged[key], value)) {
            merged[key] = "mixed value";
          }
        }
        });
        return merged;
      }, {});
    }
  
    postproductData(data: any) {
      this.productService?.addProduct(data)?.subscribe({
        next: (res: any) => {},
        error: (err: HttpErrorResponse) => {},
        complete: () => {
          this.closeRightSidebar();
          this._util.snackNotification('success','Hurray!!', 'Product created successfully');
        }
      });
    }
  
    updateproductData(data: any) {
      this.productService?.updateProduct(this.activatedRoute.snapshot.url[1].path,data)?.subscribe({
        next: (res: any) => {},
        error: (err: HttpErrorResponse) => {},
        complete: () => {
          this.closeRightSidebar();
          this._util.snackNotification('success','Hurray!!','Product updated successfully');
        }
      });
    }
  
    bulkUpdateproductData(data: any){
      const transformData = (baseObj: any, array: any[]) => {
        return array.map(item => ({
          ..._.mapValues(baseObj, (value, key) => value === "mixed value" ? item[key] : value),
          id: item.id // Ensure id is added
        }));
      };
      const result = transformData(data, this.bulkSelectedData);
  
      const updateRequests = result.map((item:any) =>
        this.productService?.updateProduct(item.id, item)
      );
    
      forkJoin(updateRequests).subscribe({
        next: (responses) => {
          this._util.snackNotification('success', 'Success!', 'All products updated successfully');
        },
        error: (error) => {
          this._util.snackNotification('error', 'Oops!', 'Some updates failed');
        },
        complete: () => {
          this.closeRightSidebar();
        }
      });
   
    }
}
