import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productForm: FormGroup;
  sizes = ['S', 'M', 'L', 'XL'];
  isBulkEditMode = false;
  selectedProductIds: number[] = [];
  productsToEdit: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      size: ['', Validators.required],
      brand: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      color: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/), Validators.minLength(5), Validators.maxLength(10)]],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  get f() {
    return this.productForm.controls;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['ids']) {
        this.isBulkEditMode = true;
        this.selectedProductIds = params['ids']
          .split(',')
          .map((id: string): number | null => {
            const parsedId = Number(id);
            return isNaN(parsedId) ? null : parsedId;
          })
          .filter((id: number | null): id is number => id !== null);
          this.loadProductsForBulkEdit();
      } else if (params['id']) {
        this.productService.getProductById(params['id']).subscribe(product => {
          if (product) {
            this.productForm.patchValue(product);
          }
        });
      }
    });
  }
  

  loadProductsForBulkEdit() {
    this.productService.getProducts().subscribe(products => {
      this.productsToEdit = products.filter(product => 
        product.id !== undefined && this.selectedProductIds.includes(product.id)
      );

      if (this.productsToEdit.length > 0) {
        this.populateFormForBulkEdit();
      }
    });
  }

  populateFormForBulkEdit() {
    if (!this.productsToEdit.length) {
      return;
    }
    const formValues: any = {};
    const fields = ['productName', 'size', 'brand', 'color', 'code', 'quantity'];
    fields.forEach(field => {
      const values = this.productsToEdit
        .map(product => product[field as keyof Product])
        .filter(value => value !== undefined);
      const uniqueValues = new Set(values);
      formValues[field] = uniqueValues.size === 1 ? values[0] : ''; 
    });
    this.productForm.patchValue(formValues);
    this.productForm.markAsTouched();
    this.productForm.updateValueAndValidity();
  }
  

  onSubmit() {
    if (this.productForm.invalid) return;
    const productData: Product = this.productForm.value;
    if (this.isBulkEditMode) {
      this.productsToEdit.forEach(product => {
        if (product.id !== undefined) {
          const updatedProduct = { ...product, ...productData };
          this.productService.updateProduct(product.id, updatedProduct).subscribe();
        }
      });
      this.router.navigate(['/products']);
    } else if (this.route.snapshot.queryParams['id']) {
      this.productService.updateProduct(this.route.snapshot.queryParams['id'], productData).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.addProduct(productData).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}
