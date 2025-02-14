import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationBulkEditComponent } from './location-bulk-edit.component';

describe('LocationBulkEditComponent', () => {
  let component: LocationBulkEditComponent;
  let fixture: ComponentFixture<LocationBulkEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationBulkEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationBulkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
