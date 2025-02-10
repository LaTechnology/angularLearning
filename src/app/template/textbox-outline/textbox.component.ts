import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lt-textbox-outline',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextboxComponent)
    }
  ]
})
export class TextboxComponent implements OnInit, ControlValueAccessor {
  @Input() label: any;
  @Input() minValue: number = 0;
  @Input() minValueMessage: string = '';
  @Input() minLength: number = 0;
  @Input() minLengthMessage: string = '';
  @Input() maxValue!: number;
  @Input() maxValueMessage: string = '';
  @Input() maxLength!: number;
  @Input() maxLengthMessage: string = '';
  @Input() decimal: number = 1;
  @Input() matHind: boolean = false;
  @Input() type: string = 'text';
  @Input() placeHolder!: string;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() isFocusOut: boolean = true;
  @Input() isEmail = false;
  @Input() control: any = new FormControl();
  @Input() message: any
  @Input() customClass: any = ''
  @Input() iconClass: any = ''
  @Input() tooltipClass: any
  @Input() autoComplete: any;

  @Input() suffixIcon: any = '';
  @Input() prefixIcon: any = '';
  @Input() showPrefix: boolean = false;
  @Input() showSuffix: boolean = false;
  @Input() hide: boolean = false;
  @Input() suffixText!: string;
  @Output() iconClick = new EventEmitter<any>();
  @Output() hidePassword = new EventEmitter<boolean>();
  @Output() onValueChange = new EventEmitter<Event>();
  @Output() onFocusOut = new EventEmitter<Event>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() inputChange = new EventEmitter<any>();
  @Output() keydown = new EventEmitter<any>();
  @Output() paste = new EventEmitter<any>()
  @Output() select = new EventEmitter<any>()

  @ViewChild('textBox', { static: false })
  inputElement!: ElementRef;

  constructor() { }

  onSelectInputValue() {
    this.onSelect.emit(this.inputElement)
  }

  ngOnInit(): void { }
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

  /**
   *Func triggered on input change
   */
  onchange(event: any) {
    this.onChange(event.target.value);
    this.onValueChange.emit(event.target.value);
  }

  focusInput() { }

  focusOutInput(event: any) {
    this.onFocusOut.emit(event);
  }

  iconClicked() {
    this.hide = !this.hide;
    this.iconClick.emit(this.hide);
  }

  inputValueChange(event: any) {
    if (this.isEmail) {
      const input = event.target;
      const cursorPosition = input.selectionStart; // Get current cursor position
      input.value = input.value.toLowerCase(); // Convert input value to lowercase
      input.setSelectionRange(cursorPosition, cursorPosition); // Set cursor position back to its original position
    } else {
      this.inputChange.emit(event)
    }
  }

  keyDownEvent(event: any) {
    this.keydown.emit(event);
  }

  onPaste(event: ClipboardEvent) {
    if (this.isEmail) {
      // Get pasted text
      const clipboardData = event.clipboardData || (window as any).clipboardData;
      clipboardData.setData('text', clipboardData.getData('text').toLowerCase());
    } else {
      this.paste.emit(event)
    }

  }

  onValueSelect(event: any) {
    this.select.emit(event)
  }
}
