import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailMenu } from './thumbnail-menu';

describe('ThumbnailMenu', () => {
  let component: ThumbnailMenu;
  let fixture: ComponentFixture<ThumbnailMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThumbnailMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
