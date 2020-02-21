import { async, TestBed } from '@angular/core/testing';
import { NiDatetimePipeModule } from './ni-datetime-pipe.module';

describe('NiDatetimePipeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NiDatetimePipeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NiDatetimePipeModule).toBeDefined();
  });
});
