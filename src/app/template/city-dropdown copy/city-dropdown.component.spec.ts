import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityDropdownComponent } from './city-dropdown.component';

describe('CityDropdownComponent', () => {
  let component: CityDropdownComponent;
  let fixture: ComponentFixture<CityDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CityDropdownComponent]
    });
    fixture = TestBed.createComponent(CityDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
