import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeGrid } from './home-grid';

describe('HomeGrid', () => {
  let component: HomeGrid;
  let fixture: ComponentFixture<HomeGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
