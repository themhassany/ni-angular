import { Component, OnInit } from '@angular/core';
import { NiDatetimeLocale, NiJalaliDatetime, Locales } from 'ni-datetime';
import { NiDatetimePipeService } from 'ni-datetime-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  value: any = '2010-10-10'; //  = new Date();
  defaultDate; // = new Date();
  monthPicker = false;
  datePicker = true;
  timePicker = false;
  inline = true;
  showLocaleSwitch = true;
  locale = 'fa_AF';
  inputFormat = 'YYYY-MM-DD';
  placeholder = 'date/time';
  titleFormat = 'YYYY MMMM';
  monthHeaderFormat = 'MMMM';
  numberOfMonths = 1;
  disabledDates = [];
  disabledDatesStr = '2020-01-02 00:00:00,2020-01-03 00:00:00';
  disableWeekends = false;
  showWeekNums = false;
  selectionMode = 'single';
  selectedSeparator = ', ';
  showPickerIcon = true;
  showTodayBtn = true;
  todayBtnText = '';
  showClearBtn = true;
  clearBtnText = '';
  todayBtnSet = 'andValue';
  showYearNavigator = false;
  yearNavigatorRange = '1370,1410';
  showMonthNavigator = false;
  navByScroll = true;

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

  number_en2fa = {
    "1": "۱", "2": "۲", "3": "۳", "4": "۴", "5": "۵",
    "6": "۶", "7": "۷", "8": "۸", "9": "۹", "10": "۱۰", "11": "۱۱", "12": "۱۲",
    "13": "۱۳", "14": "۱۴", "15": "۱۵", "16": "۱۶", "17": "۱۷", "18": "۱۸",
    "19": "۱۹", "20": "۲۰", "21": "۲۱", "22": "۲۲", "23": "۲۳", "24": "۲۴", "25": "۲۵",
    "26": "۲۶", "27": "۲۷", "28": "۲۸", "29": "۲۹", "30": "۳۰", "31": "۳۱"
  };

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
