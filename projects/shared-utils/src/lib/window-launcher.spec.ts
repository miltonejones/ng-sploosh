import { TestBed } from '@angular/core/testing';

import { WindowLauncher } from './window-launcher';

describe('WindowLauncher', () => {
  let service: WindowLauncher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowLauncher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
