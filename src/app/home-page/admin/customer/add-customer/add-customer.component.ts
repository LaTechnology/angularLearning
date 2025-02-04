import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer, CustomerType } from '../customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { v4 as uuidv4 } from 'uuid';
import { addCustomer, addCustomerSuccess, loadCustomerById, updateCustomer } from '../store/customer.action';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCustomerById } from '../store/customer.selector';
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent implements OnInit {


  customerForm: FormGroup;
  customerId: string | null = null;
  isEditMode = false;
  customer$: Observable<Customer | undefined>;
  isEditEnabled = false;
  originalCustomerData!: Customer; 
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.customerForm = this.fb.group({
      customerId:[],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternativePhoneNumber: [''],
      isActive: [true],
      customerType: [''],
      gender: ['', Validators.required],
    });

    this.customer$ = new Observable<Customer | undefined>();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.customerId = params.get('customerId');
      if (this.customerId) {
        this.isEditMode = true;
        this.customer$ = this.store.select(selectCustomerById(this.customerId));
        this.customer$.subscribe(customer => {
          if (customer) {
            this.customerForm.patchValue(customer);
            this.originalCustomerData = this.customerForm.value;
          }
        });

        // Dispatch action to load the customer data if not already loaded
      }
    });

    this.customerForm.valueChanges.subscribe(() => {
      this.isEditEnabled = !this.isFormUnchanged();
    });
  }

  isFormUnchanged(): boolean {
    return JSON.stringify(this.customerForm.value) === JSON.stringify(this.originalCustomerData);
  }
  onSubmit() {
    if (this.customerForm.valid) {
      if (this.isEditMode) {
        const updatedCustomer: Customer = {
         id: this.customerId!,
          ...this.customerForm.value
        };
        console.log(this.customerForm.value)
         this.store.dispatch(updateCustomer({ customer: updatedCustomer }));
        alert('Customer updated successfully!');
      } else {
        const newCustomer: Customer = {
          customerId: uuidv4(),
          ...this.customerForm.value
        };
        this.store.dispatch(addCustomer({ customer: newCustomer }));

        console.log(newCustomer)
        alert('Customer added successfully!');
      }
      this.router.navigate(['/customer']);
    }
  }
}


