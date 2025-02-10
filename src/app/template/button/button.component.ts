import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lt-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  dropdown:number = -1
  openDropdown:boolean = false
  openIconDropdown:boolean = false
  @Input() btnType: any = '';
  @Input() htmlType: 'button' | 'submit' | 'reset' = 'button';
  @Input() iconType:string = ''
  @Input() color: string = '';
  @Input() position: string = '';
  @Input() iconName: any = 'down-arrow';
  @Input() iconNames: string[] = ['download','vertical-line','down-arrow'];
  @Input() customClass: string = 'bg-transparent';
  @Input() disabled: boolean = false;
  @Input() formats!: any[];
  @Input() btnWidth: any;
  @Input() expandWidth!:number;
  @Input() expandHeight!:number;
  @Input() zIndex!: number;
  @Input() btnClass:any = ''
  @Input() icon: boolean = false;
  @Input() iconPrefix: boolean = false;
  @Input() iconClass: any = 'icon-18';
  @Input() btnHeight: any;
  @Input() btnValidity: boolean = true;
  @Input() filter: boolean = false;
  @Input() background!: any;
  @Input() dropdownList:any[] = []
  @Input() activeAction:any = this.dropdownList[0]
  @Input() activeClass: string ='';
  @Input() textClass:string = "color-primary";
  @Input() activeCondition: boolean = false;
  @Output() selectedValue = new EventEmitter();
  /* click EventEmitter is only for dropdown buttons
     Use default (click) event for other buttons 
  */
  @Output() btnClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  /**
   * set Button Color
   * @param color
   * @returns
   */
  btnColor(color: string) {
  
  if (color == 'orange') {
      return '#0277BD';
    } else if (color == 'blue') {
      return '#D13147';
    }
    return;
  }

  optionSelection(event: Event, option: any) {
    event.stopPropagation();
    this.selectedValue.emit(option);
  }

  getActiveClass() {
    if(this.activeCondition) {
      return `${this.activeClass}`;
    }
    return;
  }
 btnControl:boolean = false;
  buttonClick() {
    if(this.btnType === 'outline' || 'dropdown') {
      this.openDropdown = !this.openDropdown;
    }
    this.btnControl=!this.btnControl
    this.btnClick.emit(this.btnControl);
  }

  toggleMenu(){
    if(!this.openDropdown) this.openDropdown = true
    else this.openDropdown = false
  }

  toggleArrow(icon:any){
    if(icon === 'down-arrow'){
      this.openDropdown = !this.openDropdown
    }
  }
}
