import { Component, Input, OnInit, Optional, Inject} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit{
  @Input() data!: any;
  @Input() type!: any;
  employees:any
  comments:FormControl = new FormControl('')
  constructor(
    @Optional() public _dialog: MatDialogRef<ConfirmationPopupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) protected _matData: {action: any, type?:any, employees?:any[]}
  ) { } 

  ngOnInit(): void {
    this.data = this._matData.action;
    this.type = this._matData.type
    this.employees = Array.isArray(this._matData.employees) ? Array.from(new Set(this._matData.employees.map((value:any) => value?.requested_for))) : []
  }

  cancelPopup() {
    this._dialog.close(this.data.cancelText);
  }

  isCommentsRequired() {
    return this.type === 'container' && this.data?.is_comments_required && this.comments.valid
  }

  confirmPopup() {
    this.comments.markAllAsTouched()
    if(this.isCommentsRequired() || this.type !== 'container') {
      this._dialog.close(this.type !== 'container' ? true : { value:true, comments:this.comments.value});
    }
  }
}
