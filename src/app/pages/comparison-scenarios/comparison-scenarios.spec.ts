import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonScenarios } from './comparison-scenarios';

describe('ComparisonScenarios', () => {
  let component: ComparisonScenarios;
  let fixture: ComponentFixture<ComparisonScenarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonScenarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonScenarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
