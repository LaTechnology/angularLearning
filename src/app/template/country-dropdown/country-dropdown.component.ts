import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Country, State } from 'country-state-city';
import { map, startWith } from 'rxjs';
//import currencyList from 'src/assets/data/currencies.json';

@Component({
  selector: 'wz-country',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CountryDropdownComponent)
    }
  ]
})
export class CountryDropdownComponent {


  @Input() placeHolder: any;
  @Input() label: any;
  @Input() disable: boolean = false;
  @Input() control: any = new FormControl();
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() Hide: boolean = false;
  currency: any;
  searchValue: any = "";
  @Output() onValueChange = new EventEmitter<any>();
  @Output() focusOut = new EventEmitter<any>();
  @ViewChild('input') input!: ElementRef;

  countries: any[] = [];
  filteredItems: any[] = []; // Filtered items array
  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;
  isFirstOpen = true

  constructor(private renderer: Renderer2) {
    this.countries = Country.getAllCountries();
  }

  ngOnInit(): void {
    this.filteredItems = this.countries;
    this.control.valueChanges.pipe(startWith(this.control.value),
      map((value) => typeof value === 'string' ? this._filter(value) : this.countries))
      .subscribe((filtered: any) => {
        this.filteredItems = filtered;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredItems = this.countries
  }

  onChange = (data: any) => { }
  onTouch = (_: any) => { }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(event: any) {
    this.onChange(event);
    this.searchValue = event;
  }


  onSelectionChange(event: any) {
    // Handle the selection change event here
    this.onChange(event.option.value);
    this.searchValue = event.option.value;
    const countryID = this.countries.find(item => item.name === event.option.value)?.isoCode ?? null;
    //this.currency = currencyList.find((currency:any) => currency.isoAlpha2 === countryID);
    const code = this.currency?.currency
    let state = State.getStatesOfCountry(countryID);
    this.onValueChange.emit({ state: state, value: countryID, code: code });
  }

  onSearch(event: any) {
    const value = event.value;
    this.searchValue = value;
    this.filteredItems = this._filter(value)
  }

  focusOutCountry(event: any) {
    if (!this.Hide) {
      setTimeout(() => {
        const booleanValue = this.countries.some((item: any) => item.name === event.target.value)
        if (!booleanValue) {
          this.input.nativeElement.value = '';
          this.onChange('');
          this.filteredItems = this.countries;
          this.focusOut.emit()
        }
      }, 400);
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
    return name != '' ? this.countries.filter(option => option.name.toLowerCase().includes(filterValue)) : this.countries;
  }

}


