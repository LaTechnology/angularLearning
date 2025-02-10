import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer, CustomerType } from '../customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { v4 as uuidv4 } from 'uuid';
import {
  addCustomer,
  addCustomerSuccess,
  loadCustomerById,
  updateCustomer,
} from '../store/customer.action';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCustomerById } from '../store/customer.selector';
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent implements OnInit {
  customerForm: FormGroup;
  customerId: string | null = null;
  isEditMode = false;
  isBulkEditMode = false;
  isEditEnabled = false;
  isEditEnabled1=false
  customer$: Observable<Customer | undefined>;
  selectedCustomerIds: string[] = [];
  editableFields: Set<string> = new Set();
  originalCustomerData!: Customer;
   customerDataList: Customer[] = [];
   originalBulkCustomerData!:Customer
   isSame:boolean=false
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternativePhoneNumber: [''],
      isActive: [true],
      gender: ['', Validators.required],
    });
  
    this.customer$ = new Observable<Customer | undefined>();
  }
  
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.customerId = params.get('customerId');
  
      this.route.queryParamMap.subscribe((queryParams) => {
        const selectedCustomers = queryParams.get('selectedCustomers');
  
        if (selectedCustomers) {
         // this.isBulkEditMode = true
          this.selectedCustomerIds = selectedCustomers.split(',');
           this.isBulkEditMode = this.selectedCustomerIds.length >= 1; 
          this.selectedCustomerIds.forEach((id) => {
            this.store.select(selectCustomerById(id)).subscribe((customer) => {
              if (customer) {
                this.customerDataList.push(customer);
                if (this.customerDataList.length === this.selectedCustomerIds.length) {
      
                  this.compareAndSetFormValues(this.customerDataList);
                }
              }
            });
          });
        } else {
          this.isBulkEditMode = false; 
          this.customerForm.enable();
        }
      });
  
      if (this.customerId) {
        this.isEditMode = true;
        this.customer$ = this.store.select(selectCustomerById(this.customerId));
        this.customer$.subscribe((customer) => {
          if (customer) {
            this.originalCustomerData = { ...customer };
            this.customerForm.patchValue(customer);
          }
        });
      }
    });
  
    this.customerForm.valueChanges.subscribe(() => {
      this.isEditEnabled = !this.isFormUnchanged();
    });
  }
  
  isFormUnchanged(): boolean {
    return JSON.stringify(this.customerForm.value) === JSON.stringify(this.originalCustomerData);
  }
  
  
  compareAndSetFormValues(customers: any[]) {
    const formValues: any = {};  
    Object.keys(customers[0]).forEach((field) => {
      const values = customers.map((c) => c[field]);
      const firstValue = values[0];
  
      if (values.every((value) => value === firstValue)) {
        formValues[field] = firstValue; 
         this.customerForm.controls[field]?.enable();
         
      } else {
        formValues[field] = 'Mixed Value';
       // this.customerForm.controls[field]?.setValue('Mixed Value');
        this.customerForm.controls[field]?.disable();
        this.isSame=true;
    
        this.editableFields.add(field); 
      }
    });

    this.customerForm.patchValue(formValues);
  }


  toggleFieldEdit(field: string): void {
    if (this.editableFields.has(field)) {
      this.customerForm.controls[field]?.enable();
      this.editableFields.delete(field); 
    
    } else {
      this.customerForm.controls[field]?.setValue('Mixed Value');
      this.customerForm.controls[field]?.disable();
      this.editableFields.add(field); 
    }

  }
  
  
  onSubmit() {
    if (this.customerForm.valid) {
      if (this.isBulkEditMode && this.selectedCustomerIds) {
  
    console.log('Before Save:', this.customerForm.value);
  
    const updatedCustomers = this.customerDataList.map((customer) => {
      const updatedCustomer: any = { ...customer };
  
      Object.keys(this.customerForm.value).forEach((field) => {
        const newValue = this.customerForm.get(field)?.value;
  
        if (newValue !== 'Mixed Value') {
          updatedCustomer[field] = newValue; 
        }
      });
  
      return updatedCustomer;
    });
  
    updatedCustomers.forEach((customer) => {
      this.store.dispatch(updateCustomer({ customer }));
    });
  
  
        alert('Selected customers updated successfully!');
      } else if (this.isEditMode && this.customerId) {
        const updatedCustomer: Customer = { id: this.customerId, ...this.customerForm.value };
        this.store.dispatch(updateCustomer({ customer: updatedCustomer }));
        alert('Customer updated successfully!');
      } else {
        const newCustomer: Customer = { ...this.customerForm.value };
        this.store.dispatch(addCustomer({ customer: newCustomer }));
        alert('Customer added successfully!');
      }
      this.router.navigate(['/customer']);
    }

}
}
