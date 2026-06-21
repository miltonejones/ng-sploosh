import { TestBed } from '@angular/core/testing';

import { DynamoStorageService } from './dynamo-storage.service';

describe('DynamoStorageService', () => {
  let service: DynamoStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamoStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
