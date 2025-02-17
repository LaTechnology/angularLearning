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
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class AddProductComponent {
  productForm!: FormGroup;
  locationForm!: FormGroup;
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
    this.initiateLocationForm();
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
    });
  }

  initiateLocationForm() {
    this.locationForm = new FormGroup({
      locations: this.fb.array([]),
    });
  }

  save() {
    this.productForm.markAllAsTouched();
    if (this.productForm.valid) {
      let mergedObj = _.assign(
        {},
        this.productForm.value,
        this.locationForm.value
      );
      if (this.activatedRoute.snapshot.url[0].path === 'add') {
        this.postproductData(mergedObj);
      } else if (this.activatedRoute.snapshot.url[0].path === 'edit') {
        this.updateproductData(mergedObj);
      } else if (this.activatedRoute.snapshot.url[0].path === 'bulk-edit') {
        this.bulkUpdateproductData(mergedObj);
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
      this.productForm.patchValue(this.result);
    });
  }

  getCheckboxState(
    locationId: number
  ): 'checked' | 'unchecked' | 'intermediate' {
    let selectedCount = 0;
    let totalProducts = this.bulkSelectedData.length;

    this.bulkSelectedData.forEach((product) => {
      if (product.locations.some((loc: any) => loc.id === locationId)) {
        selectedCount++;
      }
    });
    if (selectedCount === totalProducts) {
      return 'checked';
    } else if (selectedCount === 0) {
      return 'unchecked';
    } else {
      return 'intermediate';
    }
  }


  onLocationChange(location: any) {
    const checkboxState = this.getCheckboxState(location.id);
  
    if (this.isBulkEdit) {
      if (checkboxState === 'checked') {
        this.toggleLocationInBulk(location, false); // Remove from all
      } else {
        this.toggleLocationInBulk(location, true); // Add to all
      }       
    } else {
      this.toggleLocationInSingle(location);
    }
  }
  

  mergeObjectsById(objects: any[]): any {
    return objects.reduce((merged, obj) => {
      _.forEach(obj, (value, key) => {
        if (key !== 'id') {
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
        locations: item.locations,
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

  toggleLocationInSingle(location: any) {
    this.selectedLocationIds.toggle(location.id);
    const locationArray = this.locationForm.get('locations') as FormArray;

    if (this.selectedLocationIds.isSelected(location.id)) {
      locationArray.push(this.fb.control(location));
    } else {
      const index = locationArray.controls.findIndex(
        (loc) => loc.value.id === location.id
      );
      if (index !== -1) locationArray.removeAt(index);
    }
  }

  populateLocations(locations: any[]) {
    const locationArray = this.locationForm.get('locations') as FormArray;
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


  
  toggleLocationInBulk(location: any, isSelected: boolean) {
    this.bulkSelectedData = this.bulkSelectedData.map((product) => {
      const locationSet = new Set(product.locations.map((loc: any) => loc.id)); 
  
      if (isSelected) {
        if (!locationSet.has(location.id)) {
          return {
            ...product,
            locations: [...product.locations, { ...location }],
          };
        }
      } else {
        if (locationSet.has(location.id)) {
          return {
            ...product,
            locations: product.locations.filter((loc: any) => loc.id !== location.id),
          };
        }
      }
  
      return product; 
    });
  }
  

}
