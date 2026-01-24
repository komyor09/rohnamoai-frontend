import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtyDetails } from './specialty-details';

describe('SpecialtyDetails', () => {
  let component: SpecialtyDetails;
  let fixture: ComponentFixture<SpecialtyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialtyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialtyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
