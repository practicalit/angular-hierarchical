import { TestBed } from '@angular/core/testing';

import { VitsService } from './vits.service';

describe('VitsService', () => {
  let service: VitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
