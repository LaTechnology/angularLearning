import { Component, Input, Output, EventEmitter, input } from '@angular/core';

@Component({
  selector: 'lt-icon',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})

export class IconsComponent {
  fill = input('#fff')
  @Input() icons: string[] = []
  @Input() name: any = '';
  @Input() customClass: string = 'lt-icon';
  @Input() iconClass: string = 'icon-24';
  @Input() type: string = 'default';
  @Input() active: boolean = false;
  @Output() iconName: EventEmitter<any> = new EventEmitter;

  iconClick(name:any){
    this.iconName.emit(name)
  }
}
