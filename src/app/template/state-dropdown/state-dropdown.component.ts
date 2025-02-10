import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { City } from 'country-state-city';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'lt-state',
  templateUrl: './state-dropdown.component.html',
  styleUrls: ['./state-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => StateDropdownComponent)
    }
  ]
})
export class StateDropdownComponent {

  @Input() placeHolder: any;
  @Input() items !: any;
  @Input() label: any;
  @Input() disable: boolean = false;
  @Input() readonly: boolean = false;
  @Input() control: any = new FormControl();
  @Input() required: boolean = false;
  @Input() Hide: boolean = false;
  searchValue: any = "";
  filteredItems: any[] = []; // Filtered items array
  @Output() onValueChange = new EventEmitter<any>();
  @Output() focusOut = new EventEmitter<any>();
  @ViewChild('input') input!: ElementRef;
  constructor(private renderer: Renderer2) { }

  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;
  isFirstOpen = true

  ngOnInit(): void {
    this.filteredItems = this.items?.state
    this.control.valueChanges.pipe(startWith(this.control.value),
      map((value) => typeof value === 'string' ? this._filter(value) : this.items?.state))
      .subscribe((filtered: any) => {
        this.filteredItems = filtered;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredItems = this.items?.state
  }

  panelClick() {
    const element = document.querySelector('.cdk-overlay-pane')

    if (this.Hide && element) {
      this.renderer.addClass(element, 'hide-overlay-panel')
    }
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
    this.searchValue = value;
    this.onChange(value);
  }

  onSelectionChange(event: any) {
    // Handle the selection change event here
    this.onChange(event.option.value);
    this.searchValue = event.option.value;
    const stateID = this.items?.state.find((item: any) => item.name === event.option.value)?.isoCode ?? null;
    let cities = City.getCitiesOfState(this.items.value, stateID);
    this.onValueChange.emit({ cities: cities, value: stateID });
  }

  onSearch(event: any) {
    const value = event.value;
    this.searchValue = event.value;
    this.filteredItems = this._filter(value);
  }

  focusOutState(event: any) {
    if (!this.Hide) {
      setTimeout(() => {
        const booleanValue = this.items?.state?.some((item: any) => item.name === event.target.value)
        if (!booleanValue) {
          this.input.nativeElement.value = '';
          this.onChange('');
          this.filteredItems = this.items?.state;
          this.focusOut.emit()
        }
      }, 300);
    }
  }


  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = /^[a-zA-Z\s]*$/;
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }
  }

  onAutocompleteOpened() {
    if (this.isFirstOpen) {
      this.isFirstOpen = false;
      this.focusSelectedOption();
    }
  }

  focusSelectedOption() {
    const index = this.filteredItems.findIndex(item => item.name === this.control.value);
    if (index >= 0) {
      setTimeout(() => {
        const panel = this.autocomplete.panel.nativeElement;
        const options = panel.querySelectorAll('mat-option');
        if (options[index]) {
          const option = options[index] as HTMLElement;
          option.classList.add('mdc-list-item--selected');
          option.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
    }
  }

  private _filter(name: any) {
    const filterValue = name?.toLowerCase();
    return name != '' ? this.items?.state.filter((option: any) => option.name.toLowerCase().includes(filterValue)) : this.items?.state;
  }



}
