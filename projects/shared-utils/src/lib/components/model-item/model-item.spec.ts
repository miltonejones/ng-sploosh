import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelItem } from './model-item';

describe('ModelItem', () => {
  let component: ModelItem;
  let fixture: ComponentFixture<ModelItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
