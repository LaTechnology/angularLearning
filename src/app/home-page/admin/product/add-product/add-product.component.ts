import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { UtilService } from 'app/services/util.service';
import { SessionStorageService } from 'app/services/session-storage.service';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  productForm!: FormGroup;
  sizes = ['S', 'M', 'L', 'XL'];
  productSideBarOpen: boolean = false;
  productSidebar: boolean = false;
  headerTittle: string = 'Add New Product';
  saveTittle: string = 'Save';
  bulkSelectedData: any[] = [];
  result: any;
  locations: any[] = [];
  selectedLocationIds = new SelectionModel<any>(true); 
  product_submit$: any;
  isBulkEdit = false;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public _session: SessionStorageService,
    public _util: UtilService
  ) {}

  ngOnInit() {
    this.productService.getAllLocation().subscribe((data: any) => {
      this.locations = data;
    });
    this.initialLoad(this.activatedRoute.snapshot.url[0].path);
  }

  initialLoad(productAction: string) {
    this.productSideBarOpen = true;
    this.productSidebar = true;
    this.initiateproductForm();
    if (productAction == 'edit') {
      this.selectedDataApi(this.activatedRoute.snapshot.url[1].path);
      this.headerTittle = 'Update Product';
      this.saveTittle = 'Update';
    }
    if (productAction === 'add') {
      this.headerTittle = 'Add New Product';
      this.saveTittle = 'Save';
    } else if (productAction === 'bulk-edit') {
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
      productName: new FormControl('', [Validators.required]),
      size: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      locations: this.fb.array([]),
    });
  }

  save() {
    this.productForm.markAllAsTouched();
    if (this.productForm.valid) {
      if (this.activatedRoute.snapshot.url[0].path === 'add') {
        this.postproductData(this.productForm.value);
      } else if (this.activatedRoute.snapshot.url[0].path === 'edit') {
        this.updateproductData(this.productForm.value);
      } else if (this.activatedRoute.snapshot.url[0].path === 'bulk-edit') {
        this.bulkUpdateproductData(this.productForm.value);
      }
    }
  }

  selectedDataApi(id: any) {
    this.isBulkEdit = false;
    this.productService?.getProductById(id)?.subscribe(
      (res: any) => {
        const data = res;
        this.productForm.patchValue(data);
        this.populateLocations(data.locations);
      },
      (err: HttpErrorResponse) => {},
      () => {}
    );
  }

  bulkSelectedDataApi(ids: any[]) {
    this.isBulkEdit = true;
    this.productService.getSelectedProductById(ids).subscribe((res: any[]) => {
      this.bulkSelectedData = res;
      this.result = this.mergeObjectsById(this.bulkSelectedData);
      this.result.locations = this.result.locations || [];

      this.productForm.patchValue(this.result);
      this.updateLocationSelection();
    });
  }

  getCheckboxState(locationId: number): 'checked' | 'unchecked' | 'intermediate' {
    let selectedCount = 0;
    let totalProducts = this.bulkSelectedData.length;
  
    this.bulkSelectedData.forEach((product) => {
      if (product.locations.some((loc: any) => loc.id === locationId)) {
        selectedCount++;
      }
    });
  console.log()
    if (selectedCount === totalProducts) {
      return 'checked';
    } else if (selectedCount === 0) {
      return 'unchecked';
    } else {
      return 'intermediate';
    }
  }
  

  onLocationChange(location: any) {
    if (this.isBulkEdit) {
      this.toggleLocationInBulk(location);
    } else {
      this.toggleLocationInSingle(location);
    }
  }

  mergeObjectsById(objects: any[]): any {
    return objects.reduce((merged, obj) => {
      _.forEach(obj, (value, key) => {
        if (key === 'locations') {
          if (!merged.locations) {
            merged.locations = [...value];
          } else {
            value.forEach((loc: any) => {
              if (!merged.locations.some((l: any) => l.id === loc.id)) {
                merged.locations.push(loc);
              }
            });
          }
        } else if (key !== 'id') {
          if (!merged.hasOwnProperty(key)) {
            merged[key] = value;
          } else if (!_.isEqual(merged[key], value)) {
            merged[key] = 'mixed value';
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
        this._util.snackNotification(
          'success',
          'Hurray!!',
          'Product created successfully'
        );
      },
    });
  }

  updateproductData(data: any) {
    this.productService
      ?.updateProduct(this.activatedRoute.snapshot.url[1].path, data)
      ?.subscribe({
        next: (res: any) => {},
        error: (err: HttpErrorResponse) => {},
        complete: () => {
          this.closeRightSidebar();
          this._util.snackNotification(
            'success',
            'Hurray!!',
            'Product updated successfully'
          );
        },
      });
  }

  bulkUpdateproductData(data: any) {
    const transformData = (baseObj: any, array: any[]) => {
      return array.map((item) => ({
        ..._.mapValues(baseObj, (value, key) =>
          value === 'mixed value' ? item[key] : value
        ),
        id: item.id,
      }));
    };
    const result = transformData(data, this.bulkSelectedData);

    const updateRequests = result.map((item: any) =>
      this.productService?.updateProduct(item.id, item)
    );

    forkJoin(updateRequests).subscribe({
      next: (responses) => {
        this._util.snackNotification(
          'success',
          'Success!',
          'All products updated successfully'
        );
      },
      error: (error) => {
        this._util.snackNotification('error', 'Oops!', 'Some updates failed');
      },
      complete: () => {
        this.closeRightSidebar();
      },
    });
  }

 

  private toggleLocationInSingle(location: any) {
    this.selectedLocationIds.toggle(location.id);
    const locationArray = this.productForm.get('locations') as FormArray;

    if (this.selectedLocationIds.isSelected(location.id)) {
      locationArray.push(this.fb.control(location));
    } else {
      const index = locationArray.controls.findIndex(
        (loc) => loc.value.id === location.id
      );
      if (index !== -1) locationArray.removeAt(index);
    }
  }

 

  private populateLocations(locations: any[]) {
    const locationArray = this.productForm.get('locations') as FormArray;
    locationArray.clear();
    if (locations?.length) {
      this.selectedLocationIds = new SelectionModel<number>(
        true,
        locations.map((loc) => loc.id)
      );
      locations.forEach((location) =>
        locationArray.push(this.fb.control(location))
      );
    }
  }

  private updateLocationSelection() {
    const locationArray = this.productForm.get('locations') as FormArray;
    locationArray.clear();
  
    const selectedIds = new Set<number>(); 
    const intermediateIds = new Set<number>(); 
    const locationCounts = new Map<number, number>(); 
    const mergedLocations: any[] = [];
  
    this.bulkSelectedData.forEach((product) => {
      if (Array.isArray(product.locations)) {
        product.locations.forEach((loc: any) => {
          locationCounts.set(loc.id, (locationCounts.get(loc.id) || 0) + 1);
          if (!mergedLocations.some((existing) => existing.id === loc.id)) {
            mergedLocations.push(loc);
          }
        });
      }
    });
  
    locationCounts.forEach((count, locId) => {
      if (count === this.bulkSelectedData.length) {
        selectedIds.add(locId);
      } else {
        intermediateIds.add(locId);
      }
    });
  
    
    mergedLocations.forEach((loc) => {
      if (selectedIds.has(loc.id) || intermediateIds.has(loc.id)) {
        locationArray.push(this.fb.control(loc)); 
      }
    });
  
  }
  

  private toggleLocationInBulk(location: any) {
    const locationId = location.id;
    const isCurrentlyChecked = this.getCheckboxState(locationId) === 'checked';
    const isIntermediate = this.getCheckboxState(locationId) === 'intermediate';
    
    this.bulkSelectedData.forEach((product) => {
     
        if (isCurrentlyChecked) {
          if (!product.locations.some((loc: any) => loc.id === locationId)) {
            product.locations.push(location);
          }
       
      } else {
        
          if (!product.locations.some((loc: any) => loc.id === locationId)) {
            product.locations.push(location);
          }
         else {
          product.locations = product.locations.filter((loc: any) => loc.id !== locationId);
        }
      }
    }
  
  );
  
    this.updateLocationSelection();
  }
  
  
  
  
}
