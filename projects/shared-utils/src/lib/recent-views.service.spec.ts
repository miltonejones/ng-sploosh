import { TestBed } from '@angular/core/testing';

import { RecentViewsService } from './recent-views.service';

describe('RecentViewsService', () => {
  let service: RecentViewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentViewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
