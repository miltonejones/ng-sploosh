import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowRegion } from './window-region';

describe('WindowRegion', () => {
  let component: WindowRegion;
  let fixture: ComponentFixture<WindowRegion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowRegion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowRegion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
