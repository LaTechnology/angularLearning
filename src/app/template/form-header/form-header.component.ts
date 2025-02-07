import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wz-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss']
})
export class FormHeaderComponent implements OnInit {

  @Input() header: any;
  @Input() splitterWidth: any;
  @Input() customClass:any;
  @Input() formHeaderClass:any = 'tittle_text';
  
  constructor() { }

  ngOnInit(): void {
  }

}
