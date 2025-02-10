import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from '../address.model';
import { AddressService } from '../address.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-address-bulk-edit',
  templateUrl: './address-bulk-edit.component.html',
  styleUrls: ['./address-bulk-edit.component.scss']
})
export class AddressBulkEditComponent implements OnInit {
  selectedAddresses: Address[] = [];
  bulkEditForm: FormGroup;
  isFieldEditEnabled: {[key:string]:boolean}={};
  initalFieldValues:{[key:string]:any}={};
  addressFields = [
    'addressLine1', 'addressLine2', 'city', 'district', 'pincode', 'state', 'country', 'region', 'landMark', 'phoneNumber', 'addressType'
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private addressService: AddressService
  ) {
    this.bulkEditForm = this.fb.group({
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      district: [''],
      pincode: [''],
      state: [''],
      country: [''],
      region: [''],
      landMark: [''],
      phoneNumber: [''],
      addressType: ['']
    });
  }

  ngOnInit(): void {
    if (history.state.selectedAddresses) {
      this.selectedAddresses = history.state.selectedAddresses;
      this.initializeForm();
    } else {
      this.router.navigate(['/address/list']);
    }

    this.addressFields.forEach(field => {
      this.isFieldEditEnabled[field] = false;
      this.bulkEditForm.get(field)?.disable();
    });
  }

  initializeForm() {
    this.addressFields.forEach(field => {
      const fieldValues = this.selectedAddresses.map(address => address[field as keyof Address]);
      const allSame = fieldValues.every(val => val === fieldValues[0]);
      const fieldValue = allSame ? fieldValues[0] : 'Mixed Value';

      this.bulkEditForm.get(field)?.setValue(fieldValue);
      this.initalFieldValues[field] = fieldValue;
      this.isFieldEditEnabled[field]=false;
    });
  }

  enableFieldEdit(field:string){
    this.isFieldEditEnabled[field] = true;
    this.bulkEditForm.get(field)?.enable();
  }

  cancelFieldEdit(field:string){
    this.isFieldEditEnabled[field] = false;
    const control = this.bulkEditForm.get(field);
    if(control){
      control.setValue(this.initalFieldValues[field]);
      control.markAsPristine();
      control.markAsUntouched();
    }
    this.bulkEditForm.get(field)?.disable();
  }
  
  onSubmit() {
    const formValues = this.bulkEditForm.value;

    this.selectedAddresses.forEach(address => {
      const updatedFields: any = {};

      Object.keys(formValues).forEach(key => {
        const control = this.bulkEditForm.get(key);

        if (control && !control.pristine) {
          address[key as keyof Address] = formValues[key];
          updatedFields[key] = formValues[key];
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        this.addressService.updateAddress(address.id, address).subscribe({
          next: (response) => {
            console.log(`Address with id ${address.id} updated successfully!`);
          },
          error: (error) => {
            console.error('Error updating address:', error);
          }
        });
      }
    });

    this.router.navigate(['/address/list']);
  }
}
