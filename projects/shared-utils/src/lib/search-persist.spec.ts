import { TestBed } from '@angular/core/testing';

import { SearchPersist } from './search-persist';

describe('SearchPersist', () => {
  let service: SearchPersist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchPersist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
