import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UtilService } from 'app/services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-add-form',
  templateUrl: './client-add-form.component.html',
  styleUrl: './client-add-form.component.scss',
})
export class ClientAddFormComponent {
  userSideBarOpen: boolean = false;
  userSidebar: boolean = false;
  userForm!: FormGroup;
  stateList: any;
  cityList: any;
  headerTittle: string = 'Add New User';
  saveTittle: string = 'Save';

  //popups
  user_submit$: any;

  constructor(public _util: UtilService, private router: Router) {}

  ngOnInit() {
    this.initialLoad('add')
  }

  initialLoad(userAction: string) {
    this.userSideBarOpen = true;
    this.userSidebar = true;
    this.initiateuserForm();
    if (userAction == 'edit') {
      this.headerTittle = 'Update User';
      this.saveTittle = 'Update';
      //this.userForm.patchValue(item);
    }
    if (userAction === 'add') {
      this.initiateuserForm();
      this.headerTittle = 'Add New User';
      this.saveTittle = 'Save';
    }
  }


  closeRightSidebar() {
    this.userSidebar = false;
    setTimeout(() => {
      this.userSideBarOpen = false;
      this.user_submit$ = null;
      this.router.navigate(['/client']);
    }, 800);
  }

  pincodeValueChange(event: any, length: number) {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // Remove all characters except digits (0-9), plus (+), and minus (-)

    if (sanitizedValue.length > length) {
      event.target.value = sanitizedValue.slice(0, length);
      event.target.value = event.target.value.toUpperCase();
    } else {
      event.target.value = sanitizedValue;
      event.target.value = event.target.value.toUpperCase();
    }

    event.preventDefault(); // Prevent the default action (e.g., typing) from happening
    event.stopPropagation(); // Stop event propagation to prevent other listeners from running
  }

  initiateuserForm() {
    this.userForm = new FormGroup({
      first_name: new FormControl('', [
        Validators.required,
        this._util.customNameValidator(),
      ]),
      last_name: new FormControl('', [
        Validators.required,
        this._util.customNameValidator(),
      ]),
      phone: new FormControl('', [Validators.required]),
      mail: new FormControl('', [
        Validators.required,
        this._util.customFieldValidator(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please enter valid Email'
        ),
      ]),
      address_line1: new FormControl('', [Validators.required]),
      address_line2: new FormControl(''),
      country: new FormControl('', Validators.required),
      state: new FormControl(''),
      city: new FormControl(''),
      pin_code: new FormControl(''),
    });
  }

  onCountryChange(event: any) {
    this.stateList = event;
    this.cityList = [];
    this.userForm.get('state')?.setValue('');
    this.userForm.get('city')?.setValue('');
    this.userForm.get('pin_code')?.setValue('');
  }

  onStateChange(event: any) {
    this.cityList = event;
    this.userForm.get('city')?.setValue('');
    this.userForm.get('pin_code')?.setValue('');
  }

  onCityChange(cityCode: any) {}

  save() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      // if (this.userAction === 'add') {
      //   this.postUserData(this.userForm.value);
      // } else if (this.userAction === 'edit') {
      //   this.updateUserData(this.userForm.value);
      // }
    }
  }

  postUserData(data: any) {
    console.log(data);
    // const formData = data;
    // this.userList.data = [...this.userList.data, formData];
    this.closeRightSidebar();
    this._util.snackNotification(
      'success',
      'Hurray!!',
      'User created successfully'
    );
  }

  updateUserData(data: any) {
    const formData = data;
    // const updatedData = [...this.userList.data]; // Create a shallow copy of the data array
    // updatedData[this.selectedIndex] = formData;
    // this.userList.data = updatedData;
    this.closeRightSidebar();
    this._util.snackNotification(
      'success',
      'Hurray!!',
      'User updated successfully'
    );
  }
}
