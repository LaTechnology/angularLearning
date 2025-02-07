import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productForm: FormGroup;
  sizes = ['S', 'M', 'L', 'XL'];

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private route: ActivatedRoute) {
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
      if (params['id']) {
        this.productService.getProductById(params['id']).subscribe(product => {
          if (product) {
            this.productForm.patchValue(product);
          }
        });
      }
    });
  }
  
  onSubmit() {
    if (this.productForm.invalid) return;
    const productData: Product = this.productForm.value;
    if (this.route.snapshot.queryParams['id']) {
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
