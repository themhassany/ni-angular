import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NiClockComponent } from './ni-clock.component';

describe('NiClockComponent', () => {
  let component: NiClockComponent;
  let fixture: ComponentFixture<NiClockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NiClockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NiClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
