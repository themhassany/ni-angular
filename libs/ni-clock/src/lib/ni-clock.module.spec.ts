import { async, TestBed } from '@angular/core/testing';
import { NiClockModule } from './ni-clock.module';

describe('NiClockModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NiClockModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NiClockModule).toBeDefined();
  });
});
