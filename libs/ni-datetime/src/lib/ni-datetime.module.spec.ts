import { async, TestBed } from '@angular/core/testing';
import { NiDatetimeModule } from './ni-datetime.module';

describe('NiDatetimeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NiDatetimeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NiDatetimeModule).toBeDefined();
  });
});
