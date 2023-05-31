import { TestBed } from '@angular/core/testing';

import { SegmentDetailService } from './segment-detail.service';

describe('SegmentDetailService', () => {
  let service: SegmentDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SegmentDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
