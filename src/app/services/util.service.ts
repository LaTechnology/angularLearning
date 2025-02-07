import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackNotificationComponent } from '../template/snack-notification/snack-notification.component';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _router: Router,
  ) { }

  customFieldValidator(regExp: RegExp, errorMsg?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = regExp.test(control.value);
      if (control.value) {
        return isValid ? null : {
          customFieldValidationError: errorMsg ? errorMsg : 'Please enter valid input',
        };
      }
      return null
    };
  }
  
  
  customNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startsWithAlphabet = /^[a-zA-Z]/.test(control.value);
      const containsSpecialChars = /^[a-zA-Z0-9/'&,(). -]*$/.test(control.value);
      if (!startsWithAlphabet) {
        return {
          customFieldValidationError: "Field must start with an alphabet",
        };
      }

      if (!containsSpecialChars) {
        return {
          customFieldValidationError: "This field only accepts special characters like ( - , / . ' & )",
        };
      }

      return null;
    };
  }

  snackNotification(action: any, title: any, content: any) {
    this.snackBar.openFromComponent(SnackNotificationComponent, {
      data: {
        action: action,
        title: title,
        content: content
      },
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  isEllipsisActive(e: HTMLElement, getWidth: boolean = false): any {
    return getWidth ? e.offsetWidth : e ? e.offsetWidth < e.scrollWidth : false;
  }
}
