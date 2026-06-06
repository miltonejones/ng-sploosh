import { TestBed } from '@angular/core/testing';

import { ModalEventService } from './modal-event.service';

describe('ModalEventService', () => {
  let service: ModalEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
