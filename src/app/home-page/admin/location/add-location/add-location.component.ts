import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from 'app/services/location.service';
import { startWith, map } from 'rxjs/operators';
import { Address } from '../../address/address.model';
import { AddressService } from '../../address/address.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  locationForm: FormGroup;
  addresses: Address[] = [];
  filteredBillingAddresses: Address[] = [];
  filteredShippingAddresses: Address[] = [];

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private addressService: AddressService,
    private router:Router
  ) {
    this.locationForm = fb.group({
      // id: [''],
      name: ['', [Validators.required]],
      billingAddress: [null],  
      shippingAddress: [null, [Validators.required]], 
    });
  }

  ngOnInit() {
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

  private _filterAddresses(value: string ): Address[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

      return this.addresses.filter(address =>
        address.addressLine1.toLowerCase().includes(filterValue) ||
        address.city.toLowerCase().includes(filterValue) ||
        address.pincode.includes(filterValue)
      );

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


      this.locationService.addLocation(location).subscribe(
        (response) => {

          this.router.navigate(['/location/list']);
        },
        (error) => {
          alert('Error creating new Location');
        }
      );

      
       
    }
  }
}
