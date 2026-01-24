import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioResults } from './scenario-results';

describe('ScenarioResults', () => {
  let component: ScenarioResults;
  let fixture: ComponentFixture<ScenarioResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenarioResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
