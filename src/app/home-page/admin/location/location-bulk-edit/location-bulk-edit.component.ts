import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from 'app/services/location.service';
import { startWith, map } from 'rxjs/operators';
import { Address } from '../../address/address.model';
import { AddressService } from '../../address/address.service';

@Component({
  selector: 'app-location-bulk-edit',
  templateUrl: './location-bulk-edit.component.html',
  styleUrls: ['./location-bulk-edit.component.scss']
})
export class LocationBulkEditComponent implements OnInit {
  selectedLocations: any[] = [];
  locationForm: FormGroup;
  addresses: Address[] = [];
  filteredBillingAddresses: Address[] = [];
  filteredShippingAddresses: Address[] = [];
  isFieldEditEnabled: { [key: string]: boolean } = {};
  initialFieldValues: { [key: string]: any } = {};
  locationFields = ['name', 'billingAddress', 'shippingAddress'];

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private addressService: AddressService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      billingAddress: [null],
      shippingAddress: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (history.state.selectedLocations) {
      this.selectedLocations = history.state.selectedLocations;
      console.log(this.selectedLocations);
      this.initializeForm();
    } else {
      this.router.navigate(['/locations/list']);
    }

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

    this.locationFields.forEach(field => {
      this.isFieldEditEnabled[field] = false;
      this.locationForm.get(field)?.disable();
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
    } else {
      return this.addresses;
    }
  }

  initializeForm() {
    this.locationFields.forEach(field => {
      const fieldValues = this.selectedLocations.map(location => {
        if (typeof location[field] === 'string') {
          return location[field];
        } else if (location[field] && location[field].hasOwnProperty('id')) {
          // If it's an Address object, get the id
          return location[field].id;
        }
      });

      const allSame = fieldValues.every(val => val == fieldValues[0]);
      const fieldValue = allSame ? fieldValues[0] : 'Mixed Value';

      this.locationForm.get(field)?.setValue(fieldValue);
      this.initialFieldValues[field] = fieldValue;
      this.isFieldEditEnabled[field] = true;
    });
  }

  enableFieldEdit(field: string) {
    this.isFieldEditEnabled[field] = true;
    this.locationForm.get(field)?.enable();
    this.locationForm.get(field)?.setValue("");
  }

  cancelFieldEdit(field: string) {
    this.isFieldEditEnabled[field] = false;
    const control = this.locationForm.get(field);
    if (control) {
      control.setValue(this.initialFieldValues[field]);
      control.markAsPristine();
      control.markAsUntouched();
    }
    this.locationForm.get(field)?.disable();
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

      this.selectedLocations.forEach(selectedLocation => {
        Object.keys(location).forEach(key => {
          if (location[key] !== 'Mixed Value' && location[key] !== this.initialFieldValues[key]) {
            selectedLocation[key] = location[key];
          }
        });

        this.locationService.updateLocation(selectedLocation.id, selectedLocation).subscribe({
          next: () => {
            this.router.navigate(['/location/list']);
          },
          error: (err) => console.error('Error updating location:', err),
        });
      });

    }
  }
}
