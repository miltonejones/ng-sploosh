import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDropdown } from './model-dropdown';

describe('ModelDropdown', () => {
  let component: ModelDropdown;
  let fixture: ComponentFixture<ModelDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
