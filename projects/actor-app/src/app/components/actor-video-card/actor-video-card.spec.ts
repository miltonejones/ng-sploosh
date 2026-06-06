import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorVideoCard } from './actor-video-card';

describe('ActorVideoCard', () => {
  let component: ActorVideoCard;
  let fixture: ComponentFixture<ActorVideoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActorVideoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActorVideoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
