import { Component, OnInit } from '@angular/core';
import { NiDatetimeLocale, NiJalaliDatetime, Locales } from 'ni-datetime';
import { NiDatetimePipeService } from 'ni-datetime-pipe';

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
  inline = false;
  showLocaleSwitch = true;
  locale = 'fa_AF';
  inputFormat = 'YYYY-MM-DD';
  placeholder = 'date/time';
  titleFormat = '';
  monthHeaderFormat = 'MMMM';
  numberOfMonths = 1;
  disabledDates = [];
  disabledDatesStr = '2020-01-02 00:00:00,2020-01-03 00:00:00';
  disableWeekends = false;
  showWeekNums = false;
  selectionMode = 'range';
  selectedSeparator = ', ';
  showPickerIcon = true;
  showTodayBtn = true;
  todayBtnText = '';
  showClearBtn = true;
  clearBtnText = '';
  todayBtnSet = 'andValue';
  showYearNavigator = true;
  yearNavigatorRange = '1370,1410';
  showMonthNavigator = true;

  customLocale: NiDatetimeLocale = {
    name: 'Custom',
    new: () => new NiJalaliDatetime(),
    week: 'js',
    dir: 'ltr',
    firstday: 5,
    weekends: [0, 3, 5],
    daysName: ['Sun__', 'Mon__', 'Tues__', 'Weds__', 'Thurs__', 'Fri__', 'Satur__'],
    daysNameShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysNameMini: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthsName: ['January', 'February', 'March', 'April', 'May', 'June',
      'd', 'August', 'September', 'October', 'November', 'December'],
    monthsNameShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ampm: ['**', '__'],
    AMPM: [':)', ':('],
    today: 'امروز',
    clear: 'پاک'
  };

  value2 = new Date();

  constructor(private pipeService: NiDatetimePipeService) {
    this.localeChanged(null);

    setInterval(() => this.value2 = new Date(), 1000);
  }

  ngOnInit() {
    this.updateDisabledDates();
  }

  localeChanged($event: any) {
    this.pipeService.locale = Locales[this.locale];
  }

  newDate() {
    return new Date();
  }

  event($event: any, type: string) {
    console.log(`Event '${type}'`, $event);
  }

  updateDisabledDates() {
    this.disabledDates = this.disabledDatesStr.split(',')
      .filter(date => date.length)
      .map(date => new Date(date.trim()));
  }
}
