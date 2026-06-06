import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBox } from './modal-box';

describe('ModalBox', () => {
  let component: ModalBox;
  let fixture: ComponentFixture<ModalBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
