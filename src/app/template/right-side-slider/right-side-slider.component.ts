import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { Component, EventEmitter, input, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'app/services/util.service';
import { ConfirmationPopupComponent } from '../../model-popup/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-right-side-slider',
  templateUrl: './right-side-slider.component.html',
  styleUrls: ['./right-side-slider.component.scss'],
  animations: [
    trigger('backgroundFlyInOut', [
      transition(':enter', [
        style({ transform: 'translateX(0)' }),
        animate(
          '750ms ease-in',
          keyframes([
            style({ transform: 'translateX(100%)' }),
            style({ transform: 'translateX(1%)' }),
            style({ transform: 'translateX(0)' }),
          ])
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate(
          '750ms ease-out',
          keyframes([
            style({ transform: 'translateX(0)' }),
            style({ transform: 'translateX(1%)' }),
            style({ transform: 'translateX(100%)' }),
          ])
        ),
      ]),
    ]),
    trigger('sidebarFlyInOut', [
      transition(':enter', [
        style({ transform: 'translateX(0)' }),
        animate(
          '750ms ease-in',
          keyframes([
            style({ transform: 'translateX(100%)' }),
            style({ transform: 'translateX(-1%)' }),
            style({ transform: 'translateX(0)' }),
          ])
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate(
          '750ms ease-out',
          keyframes([
            style({ transform: 'translateX(0)' }),
            style({ transform: 'translateX(-1%)' }),
            style({ transform: 'translateX(100%)' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class RightSideSliderComponent implements OnInit, OnDestroy {

  @Input() displayPanel: boolean = false;
  @Input() paramsName!: any;
  @Input() valid: boolean = true;
  @Input() customClass!: string;
  @Output() closePanel = new EventEmitter;
  constructor(  
    private _dialog: MatDialog,
    public _util: UtilService
  ) { }
  ngOnInit(): void { }
  ngOnDestroy(): void { }

  closeRightSidebar() {
    if (!this.valid) {
      this._dialog.open(ConfirmationPopupComponent, {
        width: '400px',
        backdropClass: "modal-popup-background",
        data: {
          action: {
            title: 'Please Confirm!',
            body: 'Are you sure you would like to close?',
            img: 'assets/images/icons/error-confirmation.svg',
            cancelButton:true,
          }
        }
      }).afterClosed().subscribe((res: any) => {
        if (res) {
          this.closePanel.emit(this.paramsName);
        }
      });
    }
    else {
      this.closePanel.emit(this.paramsName);
    }
  }
}
