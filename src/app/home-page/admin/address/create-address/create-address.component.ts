import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../address.service';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Address } from '../address.model';
import { Store } from '@ngrx/store';
import { map, Observable, startWith } from 'rxjs';
import { selectAddressById } from '../store/address.selector';
import { Country, State } from 'country-state-city';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit {
  addressForm!: FormGroup;
  title: string = "Create New Address Form";
  isEditMode: boolean = false;
  id!:string|null;
  address$:Observable<Address | undefined>;
  countries:any[] = [];
  states:any[] = [];
  cities:any[]= [];
  filteredCountries$: Observable<any[]>;
  filteredStates$:Observable<any[]>;
  filteredCities$:any[] = [];

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store:Store
  ) {
    this.addressForm = this.fb.group({
      // id: [''],
      addressId: [''],
      addressLine1: ['', [Validators.required, Validators.minLength(2)]],
      addressLine2: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      district: ['', [Validators.required, Validators.minLength(2)]],
      pincode: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      region: ['', [Validators.required, Validators.minLength(2)]],
      landMark: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      addressType: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.address$ = new Observable<Address | undefined>();

    this.countries = Country.getAllCountries();

    this.filteredCountries$ = this.addressForm.get('country')?.valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : ''; // Ensure it's a string
        return this.countries.filter(country =>
          country.name.toLowerCase().includes(filterValue)  // Filter based on the name property
        );
      })
    ) as Observable<any[]>;
    
    // this.states = State.getStatesOfCountry(this.addressForm.get('country')?.value);
    this.states = State.getAllStates();
    console.log("states -> ",this.states)
    this.filteredStates$ = this.addressForm.get('state')?.valueChanges.pipe(
      startWith(''),
      map(value=>{
        const filterValue = typeof value==='string' ? value.toLowerCase():'';
        return this.states.filter(state => 
          state.name.toLowerCase().includes(filterValue)
        )
      })
    ) as Observable<any[]>;
  
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');

      if (this.id) {
        this.isEditMode = true;
        
        // this.addressService.getAddressById(this.id).subscribe(address => {
        //   if (address) {
        //     this.addressForm.patchValue(address);
        //   }
        // }, error => {
        //   console.error('Error fetching address', error); // handle error if any
        // });

        this.address$ = this.store.select(selectAddressById(this.id));
        this.address$.subscribe((address)=>{
          if(address){
            this.addressForm.patchValue(address);
          }
        })
      }
    });
  }


  onSubmit() {
    if (this.addressForm.valid) {
      if (this.isEditMode) {
        const updatedAddress: Address = {
          ...this.addressForm.value
        };
        this.addressService.updateAddress(this.id as string,updatedAddress).subscribe(
          (response) => {
            alert('Address updated successfully');
            this.router.navigate(['/address/list']); // Navigate after success
          },
          (error) => {
            console.error('Error updating address:', error);
            alert('Error updating address');
          }
        );
      } else {
        const newAddress: Address = {
          ...this.addressForm.value,
          addressId: uuidv4()
        };
        this.addressService.addAddress(newAddress).subscribe(
          (response) => {
            alert('New address created successfully');
            this.router.navigate(['/address/list']);
          },
          (error) => {
            console.error('Error adding address:', error);
            alert('Error creating new address');
          }
        );
      }
    }
  }

}
