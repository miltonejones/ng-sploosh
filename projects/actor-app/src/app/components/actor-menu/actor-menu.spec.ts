import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorMenu } from './actor-menu';

describe('ActorMenu', () => {
  let component: ActorMenu;
  let fixture: ComponentFixture<ActorMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActorMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
