import { TestBed } from '@angular/core/testing';
import { NiDatetimePipeService } from './ni-datetime-pipe.service';

describe('NiDatetimePipeService', () => {
  let service: NiDatetimePipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiDatetimePipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
