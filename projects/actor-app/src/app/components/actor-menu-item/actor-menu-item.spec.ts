import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorMenuItem } from './actor-menu-item';

describe('ActorMenuItem', () => {
  let component: ActorMenuItem;
  let fixture: ComponentFixture<ActorMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActorMenuItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorMenuItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
