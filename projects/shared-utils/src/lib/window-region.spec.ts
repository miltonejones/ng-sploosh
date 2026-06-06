import { TestBed } from '@angular/core/testing';

import { WindowRegion } from './window-region';

describe('WindowRegion', () => {
  let service: WindowRegion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowRegion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
