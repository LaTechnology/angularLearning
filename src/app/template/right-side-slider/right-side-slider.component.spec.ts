import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSideSliderComponent } from './right-side-slider.component';

describe('RightSideSliderComponent', () => {
  let component: RightSideSliderComponent;
  let fixture: ComponentFixture<RightSideSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RightSideSliderComponent]
    });
    fixture = TestBed.createComponent(RightSideSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
