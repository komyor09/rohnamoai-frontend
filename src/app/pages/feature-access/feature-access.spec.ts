import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAccess } from './feature-access';

describe('FeatureAccess', () => {
  let component: FeatureAccess;
  let fixture: ComponentFixture<FeatureAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
