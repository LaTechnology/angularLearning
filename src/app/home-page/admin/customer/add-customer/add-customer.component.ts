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
  // customerForm: FormGroup;
  // customerId: string | null = null; 
  // isEditMode = false; 

  // constructor(
  //   private fb: FormBuilder,
  //   private customerService: CustomerService,
  //   private router: Router,
  //   private route: ActivatedRoute
  // ) {
  //   this.customerForm = this.fb.group({
  //     firstName: ['', [Validators.required, Validators.minLength(2)]],
  //     lastName: ['', [Validators.required]],
  //     age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
  //     email: ['', [Validators.required, Validators.email]],
  //     dateOfBirth: ['', Validators.required],
  //     phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  //     alternativePhoneNumber: [''],
  //     isActive: [true],
  //     customerType: [''],
  //     gender: ['', Validators.required],
  //   });
  // }

  // ngOnInit() {
  //   this.route.paramMap.subscribe(params => {
  //     this.customerId = params.get('customerId');
  //     if (this.customerId) {
  //       this.isEditMode = true;
  //       this.loadCustomerData(this.customerId);
  //     }
  //   });
  // }

  // private loadCustomerData(customerId: string) {
  //   const customer = this.customerService.getCustomerById(customerId);
  //   if (customer) {
  //     this.customerForm.patchValue(customer); 
  //   }
  // }

  // onSubmit() {
  //   if (this.customerForm.valid) {
  //     if (this.isEditMode) {
      
  //       const updatedCustomer: Customer = {
  //      customerId: this.customerId!, 
  //         ...this.customerForm.value
  //       };
  //       console.log("0000000000000000000"+ this.customerId)

  //       this.customerService.updateCustomer(updatedCustomer)
  //       alert('Customer updated successfully!');
  //     } else {
        
  //       const newCustomer: Customer = {
  //         customerId: uuidv4(),
  //         ...this.customerForm.value
  //       };
  //       this.customerService.addCustomer(newCustomer);
  //       console.log("---"+ newCustomer.age)
  //       alert('Customer added successfully!');
  //     }
  //     this.router.navigate(['/customer']);
  //   }
  // }

  customerForm: FormGroup;
  customerId: string | null = null;
  isEditMode = false;
  customer$: Observable<Customer | undefined>;

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
      console.log("fghjk",this.customerId)
      if (this.customerId) {
        this.isEditMode = true;
        this.customer$ = this.store.select(selectCustomerById(this.customerId));
        this.customer$.subscribe(customer => {
          if (customer) {
            this.customerForm.patchValue(customer);
          }
        });

        // Dispatch action to load the customer data if not already loaded
      }
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      if (this.isEditMode) {
        const updatedCustomer: Customer = {
        //  id: this.customerId!,
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


