import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfeAnchor } from './mfe-anchor';

describe('MfeAnchor', () => {
  let component: MfeAnchor;
  let fixture: ComponentFixture<MfeAnchor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfeAnchor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MfeAnchor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
