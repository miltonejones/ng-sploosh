import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dropmenu } from './dropmenu';

describe('Dropmenu', () => {
  let component: Dropmenu;
  let fixture: ComponentFixture<Dropmenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dropmenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dropmenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
