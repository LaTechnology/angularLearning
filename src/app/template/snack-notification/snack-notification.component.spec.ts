import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackNotificationComponent } from './snack-notification.component';

describe('SnackNotificationComponent', () => {
  let component: SnackNotificationComponent;
  let fixture: ComponentFixture<SnackNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SnackNotificationComponent]
    });
    fixture = TestBed.createComponent(SnackNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
