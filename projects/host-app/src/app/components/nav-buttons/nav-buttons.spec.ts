import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavButtons } from './nav-buttons';

describe('NavButtons', () => {
  let component: NavButtons;
  let fixture: ComponentFixture<NavButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
