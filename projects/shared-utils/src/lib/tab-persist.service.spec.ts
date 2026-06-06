import { TestBed } from '@angular/core/testing';

import { TabPersistService } from './tab-persist.service';

describe('TabPersistService', () => {
  let service: TabPersistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabPersistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
