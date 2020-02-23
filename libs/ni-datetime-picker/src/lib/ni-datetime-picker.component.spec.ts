import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NiDatetimePickerComponent } from './ni-datetime-picker.component';

describe('NiDatetimePickerComponent', () => {
  let component: NiDatetimePickerComponent;
  let fixture: ComponentFixture<NiDatetimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NiDatetimePickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NiDatetimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
