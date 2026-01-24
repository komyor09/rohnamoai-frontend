import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioEdit } from './scenario-edit';

describe('ScenarioEdit', () => {
  let component: ScenarioEdit;
  let fixture: ComponentFixture<ScenarioEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenarioEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
