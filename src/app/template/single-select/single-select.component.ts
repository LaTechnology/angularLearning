import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'lt-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SingleSelectComponent)
    }
  ]
})
export class SingleSelectComponent implements OnInit, ControlValueAccessor {


  @Input() items!: any[];
  @Input() placeHolder: any;
  @Input() label: any;
  @Input() readOnly: boolean = false;
  @Input() custom: boolean = false;
  @Input() control: any = new FormControl();
  @Input() required: boolean = false;
  @Input() key_name: string = 'name';
  @Input() customClass: string = '';
  @Input() labelClass: string = '';
  @Output() onValueChange = new EventEmitter<any>();
  @Output() onScrollDropdown = new EventEmitter();
  @Output() onFocusOut = new EventEmitter()
  @Input() active: any = '';
  @Input() disable_name: any = 'name';
  @Input() count: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges() {
  }

  onChange = (data: any) => { }
  onTouch = (_: any) => { }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: any) {
    this.onChange(value);
  }

  compareOptions(value: any, option: any): boolean {
    if (typeof value === 'string') {
      return value === option;
    } else if (value && typeof value === 'object') {
      return value?.id === option?.id;
    } 
    else {
      return false;
    }
  }

  // else if (value && typeof value === 'object' && value.code && option && option.code) {
  //   return value.code === option.code;
  // }

  onSelectionChange(event: any) {
    // Handle the selection change event here
    this.onChange(event.value);
    this.onValueChange.emit(event.value);
  }

  /**
*Func triggered on scroll bar go to bottom
*/
  infiniteScroll() {
    this.onScrollDropdown.emit();
  }

  onSelectFocusOut(event: any) {
    this.onFocusOut.emit(event)
  }

}
