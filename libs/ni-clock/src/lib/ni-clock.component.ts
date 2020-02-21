// source: https://cssanimation.rocks/clocks/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ni-clock',
  templateUrl: './ni-clock.component.html',
  styleUrls: ['./ni-clock.component.less']
})
export class NiClockComponent implements OnInit {

  @Input() time = new Date();
  @Input() auto = true;

  constructor() { }

  ngOnInit() {
    if (this.auto) {
      setInterval(() => this.time = new Date(), 1000);
    }
  }

  get hours() { return this.time.getHours(); }
  get minutes() { return this.time.getMinutes(); }
  get seconds() { return this.time.getSeconds(); }

  get zHour() { return `rotateZ(${this.hours * 30 + (this.minutes * 0.5)}deg)`; }
  get zMinute() { return `rotateZ(${this.minutes * 6 + (this.seconds * 0.1)}deg)`; }
  get zSecond() { return `rotateZ(${this.seconds * 6}deg)`; }
}
