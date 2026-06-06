import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelAvatar } from './model-avatar';

describe('ModelAvatar', () => {
  let component: ModelAvatar;
  let fixture: ComponentFixture<ModelAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelAvatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelAvatar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
