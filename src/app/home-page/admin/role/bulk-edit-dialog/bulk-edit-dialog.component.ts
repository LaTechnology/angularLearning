import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-edit-dialog',
  templateUrl: './bulk-edit-dialog.component.html',
  styleUrl: './bulk-edit-dialog.component.scss'
})
export class BulkEditDialogComponent {

  availableRoles = ["Admin", "general", "inventory", "orders"];
  selectedRoles: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<BulkEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.selectedRoles);
    console.log("hiii", this.selectedRoles);
  }

}
