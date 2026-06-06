import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFinder } from './model-finder';

describe('ModelFinder', () => {
  let component: ModelFinder;
  let fixture: ComponentFixture<ModelFinder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelFinder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelFinder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
