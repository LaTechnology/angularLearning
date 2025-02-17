import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from '../customer.model';
import { ActivatedRoute, Router } from '@angular/router';

import {
  addCustomer,
  loadCustomers,
  updateCustomer,
} from '../store/customer.action';
import { combineLatest, first, forkJoin, Observable, take, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectCustomerById,
  selectSelectedCustomerIds,
} from '../store/customer.selector';
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
  customer$: Observable<Customer | undefined>;
  selectedCustomerIds: string[] = [];
  editableFields: Set<string> = new Set();
  originalCustomerData!: Customer;
  customerDataList!: any[];
  isSame: boolean = false;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
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
    this.route.url.pipe(take(1)).subscribe((urlSegments) => {
      const isBulkEdit = urlSegments.some((segment) => segment.path === 'bulk');

      if (isBulkEdit) {
        this.handleBulkEdit();
      } else {
        this.handleSingleEdit();
      }
    });
  }

  private handleSingleEdit() {
    this.route.paramMap.subscribe((params) => {
      this.customerId = params.get('customerId');
      if (this.customerId) {
        this.isEditMode = true;
        this.customer$ = this.store.select(selectCustomerById(this.customerId));
        this.customer$.subscribe((customer) => {
          if (customer) {
            this.originalCustomerData = { ...customer };
            this.customerForm.patchValue(customer);
          } else {
            // this.router.navigate(['/customer/list']);
            this.store.dispatch(loadCustomers());
          }
        });
      }
    });
  }

  private handleBulkEdit() {
    this.isBulkEditMode = true;

    this.store.select(selectSelectedCustomerIds).subscribe((ids) => {
      console.log(ids);
      if (ids && ids.length > 0) {
        this.selectedCustomerIds = ids;

        const customerObservables = ids.map((id) =>
          this.store.select(selectCustomerById(id)).pipe(take(1))
        );

        console.log(customerObservables);
        //combineLatest, zip
        forkJoin(customerObservables).subscribe((customers) => {
          this.customerDataList = customers.filter(
            (customer) => customer !== null
          );
          if (this.customerDataList.length > 0) {
            this.compareAndSetFormValues(this.customerDataList);
          } else {
            this.router.navigate(['/customer/list']);
            
          }
        });
      } else {
        this.router.navigate(['/customer/list']);
      }
    });
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
        //this.customerForm.controls[field]?.setValue('Mixed Value');
        this.customerForm.controls[field]?.disable();

        this.editableFields.add(field);
      }
    });

    this.customerForm.patchValue(formValues);
  }

  toggleFieldEdit(field: string): void {
    if (this.isFieldEditable(field)) {
      this.enableField(field);
    } else {
      this.disableField(field);
    }
  }

  private isFieldEditable(field: string): boolean {
    return this.editableFields.has(field);
  }

  private enableField(field: string): void {
    this.customerForm.controls[field]?.enable();
    this.editableFields.delete(field);
  }

  private disableField(field: string): void {
    this.customerForm.controls[field]?.setValue('Mixed Value');
    this.customerForm.controls[field]?.disable();
    this.editableFields.add(field);
  }

  onSubmit() {
    if (this.customerForm.valid) {
      if (this.isBulkEditMode && this.selectedCustomerIds) {
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
        const updatedCustomer: Customer = {
          id: this.customerId,
          ...this.customerForm.value,
        };
        this.store.dispatch(updateCustomer({ customer: updatedCustomer }));
        alert('Customer updated successfully!');
      } else {
        const newCustomer: Customer = { ...this.customerForm.value };
        this.store.dispatch(addCustomer({ customer: newCustomer }));
        alert('Customer added successfully!');
      }
      this.router.navigate(['/customer/list']);
    }
  }
}
