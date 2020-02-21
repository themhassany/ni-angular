import { async, TestBed } from '@angular/core/testing';
import { NiDatetimePickerModule } from './ni-datetime-picker.module';

describe('NiDatetimePickerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NiDatetimePickerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NiDatetimePickerModule).toBeDefined();
  });
});
