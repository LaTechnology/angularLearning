import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';
@Component({
  selector: 'lt-city',
  templateUrl: './city-dropdown.component.html',
  styleUrls: ['./city-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CityDropdownComponent)
    }
  ]
})
export class CityDropdownComponent {

  @Input() placeHolder: any;
  @Input() label: any;
  @Input() disable: boolean = false;
  @Input() control: any = new FormControl();
  @Input() required: boolean = false;
  @Input() items !: any;

  searchValue: any = "";
  filteredItems: any[] = []; // Filtered items array
  @Output() onValueChange = new EventEmitter<any>();
  @ViewChild('input') input!: ElementRef;
  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;
  isFirstOpen = true

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.filteredItems = this.items?.cities
    this.control.valueChanges.pipe(startWith(this.control.value),
      map((value) => typeof value === 'string' ? this._filter(value) : this.items?.cities))
      .subscribe((filtered: any) => {
        this.filteredItems = filtered;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredItems = this.items?.cities
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
    this.onChange(event.option.value);
    this.searchValue = event.option.value;
    this.onValueChange.emit(event.option.value);
  }

  onSearch(event: any) {
    const value = event.value;
    this.searchValue = event.value;
    this.filteredItems = this._filter(value);
  }

  focusOutState(event: any) {
    setTimeout(() => {
      const booleanValue = this.items?.cities?.some((item: any) => item.name === event.target.value)
      if (!booleanValue) {
        this.input.nativeElement.value = '';
        this.onChange('');
        this.filteredItems = this.items?.cities;
      }
    }, 300);
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
    return name != '' ? this.items?.cities.filter((option: any) => option.name.toLowerCase().includes(filterValue)) : this.items?.cities;
  }


}
