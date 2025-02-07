import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { __await } from 'tslib';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor() {
  }

  @Output() liveSearch: EventEmitter<any> = new EventEmitter<any>(); // For API Search while typing..
  @Output() enterSearch: EventEmitter<any> = new EventEmitter<any>(); // For Search while click on enter or click on icon
  @Output() onScrollDropdown = new EventEmitter(); // To trigger scroll event inside the search dropdown

  @Input() disable: boolean = false; // To disable the field
  @Input() readOnly: boolean = false; // To make read only
  @Input() standAlone: boolean = true; // True decides static; False decides Hover
  @Input() background: any = '';
  isInputHover: boolean = false;
  isInputFocused = false; // To close dropdown while clicking outside

  @Input() customClass: string = ''; // Common SCSS class from parent to decide the size of BOX
  @Input() placeHolder: string = 'Search by Name';

  @Input() searchTemplate: string = ''; // To mention the dropdown design - can be updated with template if needed.
  @Input() searchWidth: any = '200'; // To mention the dropdown design - can be updated with template if needed.
  @Input() searchType: any = 'liveSearch'; // To mention the search is liveSearch or enterSearch
  @Input() key_name_one: string = ''; // To mention the key from the object to show like name or first_name, etc..,
  @Input() key_name_two: string = ''; // To mention another key if needed

  @Input() searchResults: any[] = [];
  @Input() input: any = '';
  @Output() close:EventEmitter<any> = new EventEmitter<any>();

  /**Animation distance auto-adjust while input dimension varies */
  @ViewChild('searchInputRef') searchInputRef!: ElementRef;
  @ViewChild('searchIconRef', { read: ElementRef }) searchIconRef!: ElementRef;

  translateIcon: any;

  ngOnInit(): void {
    this.closeSearch()
    this.translateIcon = 25 - this.searchWidth;
  }

  onSearch(search: any): void {
    if (search && this.searchType === 'liveSearch') {
      this.liveSearch.emit(search);
    }
    else if (search && this.searchType === 'enterSearch') {
      this.enterSearch.emit(search) 
    }
    else if (search === '') {
      this.searchType === 'liveSearch' ? this.liveSearch.emit("") : this.enterSearch.emit("");
    }
    if (typeof search === 'object') {
      const key_one = search[this.key_name_one] || '';
      const key_name = search[this.key_name_two] || '';
      const fullName = key_one && key_name ? key_one + ' ' + key_name : key_one;
    }
    this.input = search
  }

  infiniteScroll() {
    this.onScrollDropdown.emit();
  }

  clickCloseIcon(){
    this.input = '';
    this.liveSearch.emit('');
    this.enterSearch.emit('') 
    this.close.emit(true);
  }

  translateDistance(): string {
    const inputWidth = this.searchInputRef?.nativeElement?.offsetWidth || 0;
    const iconWidth = this.searchIconRef?.nativeElement?.offsetWidth || 0;
    const distance = inputWidth - (iconWidth - 5);
    return `${-distance}`;
  }

  getAnimationProperty() {
    return this.isInputHover ? `translate3d(${26 - this.searchWidth}px,0px,0)` : 'translate3d(0,0px,0)';
  }

  closeSearch(){
    if (this.input?.length > 0 && this.input != '') {
      this.isInputHover = true;
      this.isInputFocused = true;
    } else {
      this.isInputHover = false;
      this.isInputFocused = false;
    }
  }

}
