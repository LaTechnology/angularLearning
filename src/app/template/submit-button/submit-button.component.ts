import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss']
})
export class SubmitButtonComponent {

  @Input() placeholder: any;
  @Input() callback: any;
  @Input() is_sidebar: boolean = true;
  @Input() is_button: boolean = true;
  @Input() disabledBtn: boolean = true;
  @Input() btnValidity: boolean = true;
  @Input() customClass: any;
  @Output() submit = new EventEmitter();

  disabled: boolean = false;

  submitApi() {
    this.submit.emit();
    this.checkButtonValidity();
  }

  checkButtonValidity() {
    setTimeout(() => {
      if (this.callback) {
        this.disabled = true;
        this.callback.subscribe({
          error: () => {
            this.disabled = false;
          },
          complete: () => {
            this.enableButton();
          }
        })
      }
    }, 50);
  }

  enableButton() {
    if(this.is_sidebar) {
      setTimeout(() => {
        this.disabled = false;
      }, 1000);
    }
    else {
      this.disabled = false;
    }
  }

}
