import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBulkEditComponent } from './address-bulk-edit.component';

describe('AddressBulkEditComponent', () => {
  let component: AddressBulkEditComponent;
  let fixture: ComponentFixture<AddressBulkEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressBulkEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressBulkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
