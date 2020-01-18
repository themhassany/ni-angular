import { Component, OnInit } from '@angular/core';
import { NiDatetimeLocale, NiJalaliDatetime } from 'projects/ni-datetime-picker/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  value = new Date();
  defaultDate = new Date();
  monthPicker = false;
  datePicker = true;
  timePicker = false;
  inline = true;
  enableLocaleSwitch = false;
  locale = 'en_US';
  inputFormat = 'YYYY-MM-DD';
  placeholder = 'date/time';
  titleFormat = 'YYYY';
  monthHeaderFormat = 'MMMM';
  numberOfMonths = 1;
  disabledDates = [];
  disabledDatesStr = '2020-01-01 00:00:00,2020-01-02 00:00:00,2020-01-03 00:00:00';
  disableWeekends = true;
  showWeekNums = false;

  customLocale: NiDatetimeLocale = {
    name: 'Custom',
    new: () => new NiJalaliDatetime(),
    week: 'js',
    dir: 'ltr',
    firstday: 5,
    weekends: [0, 3, 5],
    daysName: ['Sunxxx', 'Monxxx', 'Tuesxxx', 'Wedsxxx', 'Thursxxx', 'Frixxx', 'Saturxxx'],
    daysNameShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysNameMini: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthsName: ['January', 'February', 'March', 'April', 'May', 'June',
      'd', 'August', 'September', 'October', 'November', 'December'],
    monthsNameShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ampm: ['am', 'pm'],
    AMPM: ['AM', 'PM']
  };

  ngOnInit() {
    this.updateDisabledDates();
  }

  newDate() {
    return new Date();
  }

  event(type: string, $event: any) {
    console.log(`Event '${type}': ${$event}`);
  }

  updateDisabledDates() {
    this.disabledDates = this.disabledDatesStr.split(',').map(date => new Date(date.trim()));
  }
}
