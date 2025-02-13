import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UtilService } from 'app/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientService } from 'app/services/client.service';
import { SessionStorageService } from 'app/services/session-storage.service';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';

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
  bulkSelectedData: any[]=[];
  result: object = {};

  //popups
  user_submit$: any;

  constructor(public _util: UtilService, private router: Router,public _client:ClientService,private activatedRoute: ActivatedRoute,public _session:SessionStorageService) {}

  ngOnInit() {
    this.initialLoad(this.activatedRoute.snapshot.url[0].path);
  }

  initialLoad(userAction: string) {
    this.userSideBarOpen = true;
    this.userSidebar = true;
    this.initiateuserForm();
    if (userAction == 'edit') {
      this.selectedDataApi(this.activatedRoute.snapshot.url[1].path)
      this.headerTittle = 'Update User';
      this.saveTittle = 'Update';
    }
    if (userAction === 'add') {
      this.headerTittle = 'Add New User';
      this.saveTittle = 'Save';
    } else if(userAction === 'bulk-upload'){
      this.headerTittle = 'Bulk Update User';
      this.saveTittle = 'Bulk Update';
      const idList = this._session.getItem('clientIDList');
      this.bulkSelectedDataApi(idList);
    }
  }


  closeRightSidebar() {
    this.userSidebar = false;
    this._client.triggerSubject.next();
    this.router.navigate(['/client']);
    setTimeout(() => {
      this.userSideBarOpen = false;
      this.user_submit$ = null;
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
      first_name: new FormControl('', [ Validators.required, this._util.customNameValidator(),]),
      last_name: new FormControl('', [Validators.required, this._util.customNameValidator(),]),
      phone: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required,this._util.customFieldValidator( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please enter valid Email'),]),
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
      if (this.activatedRoute.snapshot.url[0].path === 'add') {
        this.postUserData(this.userForm.value);
      } else if (this.activatedRoute.snapshot.url[0].path === 'edit') {
        this.updateUserData(this.userForm.value);
      } else if (this.activatedRoute.snapshot.url[0].path === 'bulk-upload'){
        this.bulkUpdateUserData(this.userForm.value);
      }
    }
  }

  selectedDataApi(id:any) {
    this._client?.getClientById(id)?.subscribe( (res: any) => {
        const data = res;
        this.userForm.patchValue(data);
      },
      (err: HttpErrorResponse) => {},
      () => { }
    );
  }

  bulkSelectedDataApi(id:any) {
    this._client?.getSelectedClientById(id)?.subscribe({
      next: (res: any) => {
        this.bulkSelectedData = res;
      },
      error: (err: HttpErrorResponse) => {},
      complete: () => {
        this.result = this.mergeObjectsById(this.bulkSelectedData);
        this.userForm.patchValue(this.result);
      }
    });
  }

  mergeObjectsById(objects: any[]): any {
    return objects.reduce((merged, obj) => {
      _.forEach(obj, (value, key) => {
        if (key !== "id") {
         if (!merged.hasOwnProperty(key)) {
          merged[key] = value;
        } else if (!_.isEqual(merged[key], value)) {
          merged[key] = "mixed value";
        }
      }
      });
      return merged;
    }, {});
  }

  postUserData(data: any) {
    this._client?.addClient(data)?.subscribe({
      next: (res: any) => {},
      error: (err: HttpErrorResponse) => {},
      complete: () => {
        this.closeRightSidebar();
        this._util.snackNotification('success','Hurray!!', 'User created successfully');
      }
    });
  }

  updateUserData(data: any) {
    this._client?.updateClient(this.activatedRoute.snapshot.url[1].path,data)?.subscribe({
      next: (res: any) => {},
      error: (err: HttpErrorResponse) => {},
      complete: () => {
        this.closeRightSidebar();
        this._util.snackNotification('success','Hurray!!','User updated successfully');
      }
    });
  }

  bulkUpdateUserData(data: any){
    const transformData = (baseObj: any, array: any[]) => {
      return array.map(item => ({
        ..._.mapValues(baseObj, (value, key) => value === "mixed value" ? item[key] : value),
        id: item.id // Ensure id is added
      }));
    };
    const result = transformData(data, this.bulkSelectedData);

    const updateRequests = result.map((item:any) =>
      this._client?.updateClient(item.id, item)
    );
  
    forkJoin(updateRequests).subscribe({
      next: (responses) => {
        this._util.snackNotification('success', 'Success!', 'All users updated successfully');
      },
      error: (error) => {
        this._util.snackNotification('error', 'Oops!', 'Some updates failed');
      },
      complete: () => {
        this.closeRightSidebar();
      }
    });
 
  }
}
