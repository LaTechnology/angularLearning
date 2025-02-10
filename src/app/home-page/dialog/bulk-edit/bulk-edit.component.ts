import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../admin/customer/customer.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrl: './bulk-edit.component.scss'
})
export class BulkEditComponent implements OnInit {
  formData!: FormGroup;
  selectedCustomers: any[] = [];
  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    public dialogRef: MatDialogRef<BulkEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private customerService: CustomerService,
   
  ) {
    this.selectedCustomers = data; 
    console.log("seleted data", this.selectedCustomers )
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    // const clonedCustomers = this.selectedCustomers.map(customer => ({ ...customer })); // Clone data
    // this.selectedCustomers = clonedCustomers;
    const group: any = {};
    // Object.keys(this.selectedCustomers[0]).forEach((key) => {
      
    //   const uniqueValues = new Set(this.selectedCustomers.map((c) => c[key]));
    //   console.log("uniqe",uniqueValues)
    //   group[key] = uniqueValues.size > 1 ? 'Mixed Value' : [...uniqueValues][0];
    // });

    Object.keys(this.selectedCustomers[0]).forEach((key) => {
      const values = this.selectedCustomers.map((c) => c[key]);
  
      const firstValue = values[0];
    
      group[key] = values.every((value) => value === firstValue) ? firstValue : 'Mixed Values';
    });
    
    console.log("Grouped Values:", group);
  
    this.formData = this.fb.group(group);

    console.log("ppp",this.formData,group)
  }
  

  onFieldChange(field: string) {
    const value = this.formData.get(field)?.value;
    if (value === 'Mixed Value') return;
  
    this.selectedCustomers = this.selectedCustomers.map((customer) => ({
      ...customer, 
      [field]: value, 
    }));
  }
  

  isMixedValue(field: string): boolean {
    console.log("fields",field)
    return this.formData.get(field)?.value === 'Mixed Value';
  }

  saveChanges() {
    const updatedCustomers = this.selectedCustomers.map(customer => ({ ...customer }));
  
    this.customerService.updateCustomersBulk(updatedCustomers).subscribe(
      (response) => {
        console.log('Bulk Update Success:', response);
        this.dialogRef.close(response);
      },
      (error) => console.error('Bulk Update Failed:', error)
    );
  }
  
  
}
