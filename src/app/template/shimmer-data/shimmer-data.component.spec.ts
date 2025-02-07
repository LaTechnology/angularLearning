import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShimmerDataComponent } from './shimmer-data.component';

describe('ShimmerDataComponent', () => {
  let component: ShimmerDataComponent;
  let fixture: ComponentFixture<ShimmerDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShimmerDataComponent]
    });
    fixture = TestBed.createComponent(ShimmerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
