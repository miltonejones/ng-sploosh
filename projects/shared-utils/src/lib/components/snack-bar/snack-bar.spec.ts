import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBar } from './snack-bar';

describe('SnackBar', () => {
  let component: SnackBar;
  let fixture: ComponentFixture<SnackBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
