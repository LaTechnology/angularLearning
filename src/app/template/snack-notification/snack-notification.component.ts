import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { UtilService } from 'app/services/util.service';

@Component({
  selector: 'lt-snack-notification',
  templateUrl: './snack-notification.component.html',
  styleUrls: ['./snack-notification.component.scss']
})
export class SnackNotificationComponent implements OnInit {
  
  constructor(
    public _util: UtilService,
    public snackBarRef: MatSnackBarRef<SnackNotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private el: ElementRef
    ) {}

    isHover: boolean= false;
    @ViewChild('snackNotification') snackNotification!: ElementRef;
    @HostListener('mouseenter', ['$event.target'])
    onMouseEnter(target: any) {
      if(this.el.nativeElement.contains(target)) {
        this.isHover = true;
        this.closeSnack(1000000);
      }
    }

    @HostListener('mouseleave', ['$event.target'])
    onMouseLeave(target: any) {
      if(this.el.nativeElement.contains(target)) {
        this.closeSnack(0);
      }
    }
  
  ngOnInit() {
    this.closeSnack(3000);
  }

  closeSnack(duration: any) {
    this.snackBarRef._open();
    this.snackBarRef._dismissAfter(duration);
  }

}
