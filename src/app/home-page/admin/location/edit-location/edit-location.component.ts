import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from 'app/services/location.service';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Address } from '../../address/address.model';
import { AddressService } from '../../address/address.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrl: './edit-location.component.scss'
})
export class EditLocationComponent {
    locationForm: FormGroup;
    addresses: Address[] = [];
    filteredBillingAddresses: Address[] = [];
    filteredShippingAddresses: Address[] = [];
    id!:string|null;
  
    constructor(
      private fb: FormBuilder,
      private locationService: LocationService,
      private addressService: AddressService,
      private activatedRoute: ActivatedRoute
    ) {
      this.locationForm = fb.group({
        id: [''],
        name: ['', [Validators.required]],
        billingAddress: [null],  
        shippingAddress: [null, [Validators.required]], 
      });
    }
  
    ngOnInit() {

      this.activatedRoute.paramMap.subscribe(params => {
        this.id = params.get('id');
        if (this.id) {
          this.locationService.getLocationById(this.id).subscribe((response) => {
            this.locationForm.patchValue(response);
          });
        } else {
          console.error('Location ID is missing');
        }
      });
      
      
      this.addressService.getAllAddresses().subscribe((addresses: Address[]) => {
        this.addresses = addresses;
        this.filteredBillingAddresses = addresses;
        this.filteredShippingAddresses = addresses;
      });
  
      this.locationForm.get('billingAddress')?.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAddresses(value))
      ).subscribe(filtered => {
        this.filteredBillingAddresses = filtered;
      });
  
      this.locationForm.get('shippingAddress')?.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAddresses(value))
      ).subscribe(filtered => {
        this.filteredShippingAddresses = filtered;
      });
    }
  
    private _filterAddresses(value: string | Address): Address[] {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    
      if (typeof value === 'string') {
        return this.addresses.filter(address =>
          address.addressLine1.toLowerCase().includes(filterValue) ||
          address.city.toLowerCase().includes(filterValue) ||
          address.pincode.includes(filterValue)
        );
      } else if (value && typeof value === 'object') {
        return this.addresses;
      } else {
        return [];
      }
    }
    
  
    onAddressSelected(event: any, addressType: string) {
      const selectedAddress = event.option.value;  
  
      if (addressType === 'billingAddress') {
        this.locationForm.get('billingAddress')?.setValue(selectedAddress); 
      } else if (addressType === 'shippingAddress') {
        this.locationForm.get('shippingAddress')?.setValue(selectedAddress);  
      }
    }
  
    displayFn(address: Address): string {
      return address ? `${address.addressLine1}, ${address.city}` : '';  
    }
  
    onSubmit() {
      if (this.locationForm.valid) {
        const location = this.locationForm.value;
        console.log(location);
  
        if(this.id){
          this.locationService.updateLocation(this.id,location).subscribe(
            (response) => {
              alert('Location updated successfully');
            },
            (error) => {
              alert('Error updating Location');
            }
          );
        }
        
      }
    }
}
