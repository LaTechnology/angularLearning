import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lt-phone',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PhoneNumberComponent)
    }
  ]
})
export class PhoneNumberComponent {
  @Input() label: any;
  @Input() placeHolder!: string;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() isFocusOut: boolean = true;
  @Input() control: any;
  @Output() onValueChange = new EventEmitter<Event>();
  @Output() onFocusOut = new EventEmitter<Event>();
  is_touched: boolean = false;

  constructor() {
  }


  ngOnInit(): void {}

  onChange = (data: any) => {
  }
  onTouch = (_: any) => {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: string) {
    this.onChange(value);
  }


  allowDigit15(target: any) {
    //Input value allowed only 15 digits
    const pattern = /^\d{0,15}$/;
    if (!pattern.test(target.value)) {
      target.value = target.value.slice(0, 15);
    }

    //number separate (3 3 4)
    // let value = target.value;
    // value = value.replace('/\D?g', '')
    // value = value.replace(/^(\d{3})(\d{3})(\d{4})(\d{0,5})/, '$1 $2 $3 $4');
    // target.value = value
    // if (value) {
    //   target.value = target.value.slice(0, 18);
    // }
  }


  /**
   *Func triggered on input change
   */
  onchange(event: any) {
    // if(!this.is_touched) {
    //   this.control?.markAsUntouched();
    // }
    this.onValueChange.emit(event.target.value);
  }

  focusOutInput(event: any) {
    // this.is_touched = true;
    // this.control?.markAsTouched();
    this.onFocusOut.emit(event);
  }

}
