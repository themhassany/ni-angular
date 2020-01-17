import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NiDatetime, NiJalaliDatetime, NiGregorianDatetime,
  NiDatetimeLocale, NiLocale, LocaleChangeEvent, Locales
} from './ni-datetime';
import { SelectEvent, ViewDate, ViewMonth, ViewUpdateEvent } from './ni-datetime-picker';

@Component({
  selector: 'ni-datetime-picker',
  templateUrl: './ni-datetime-picker.component.html',
  styleUrls: ['./ni-datetime-picker.component.less']
})
export class NiDatetimePickerComponent implements OnInit {

  __ngModel: Date;
  @Input()
  set ngModel(date: Date) {
    this.updateNgModel(date, false);
  }
  get ngModel(): Date {
    return this.__ngModel;
  }
  @Output() ngModelChange = new EventEmitter<Date>();

  // use for the view if ngModel is null
  @Input() defaultDate: Date;

  @Input() monthPicker = false;
  @Input() datePicker = true;
  @Input() timePicker = false;
  @Input() inline = false;

  @Input() localePickable = false;
  __locale: NiDatetimeLocale = Locales.fa_AF;
  @Output() localeChange = new EventEmitter<string>();
  @Input()
  set locale(locale: any) {
    this.updateLocale(locale, false);
  }
  get locale(): any {
    return this.__locale;
  }

  @Input() inputFormat = 'YYYY-MM-DD HH:mm AP';
  @Input() placeholder = '';
  @Input() titleFormat = 'MMMM YYYY';
  @Input() monthHeaderFormat = 'MMMM YYYY';

  @Output() showed = new EventEmitter<any>();
  @Output() hidded = new EventEmitter<any>();
  @Output() selected = new EventEmitter<SelectEvent>();
  @Output() focused = new EventEmitter<any>();
  @Output() blurred = new EventEmitter<any>();
  @Output() viewUpdated = new EventEmitter<ViewUpdateEvent>();
  @Output() localeChanged = new EventEmitter<LocaleChangeEvent>();

  dialogWidth: string;
  monthWidth: string;

  __numberOfMonths = 1;
  @Input()
  set numberOfMonths(months: number) {
    if (this.datePicker && !this.monthPicker) {
      this.__numberOfMonths = Math.max(1, Math.min(12, months)); // 1-12
      const columns = this.__numberOfMonths < 3 ? this.__numberOfMonths : 3;
      this.dialogWidth = `${columns * 250}px`;
      this.monthWidth = `${columns < 2 ? 100 : (columns < 3 ? 50 : 33.333)}%`;
    }
  }
  get numberOfMonths(): number {
    if (this.monthPicker) {
      this.dialogWidth = '250px';
      this.monthWidth = '33.333%';
      this.__numberOfMonths = 12;
    }

    return this.__numberOfMonths;
  }

  date: NiDatetime;
  today: ViewDate;
  selection: ViewDate;

  inputFormatted = '';
  openDialog = false;
  dialogTitle = '';
  viewMonthsMin: Date;
  viewMonthsMax: Date;
  viewMonths: ViewMonth[] = [];

  constructor() { }

  ngOnInit() {
    // in case value is set before component ready
    // re-set the value to trigger appropriate events
    this.updateLocale(this.locale, false);
    this.ngModel = this.ngModel;
    this.numberOfMonths = this.numberOfMonths;

    // open the dialog if inline
    this.openDialog = this.inline;
  }

  // 1. persiste date
  // 2. update input field
  // 3. emit event
  // 4. close dialog (if not inline and not time update)
  updateNgModel(date: Date, emit: boolean = true, timeUpdated = false) {
    this.__ngModel = date;
    this.updateInputfield();

    if (emit) {
      this.ngModelChange.emit(date ? new Date(date) : null);

      // close the dialog if not inline and time update
      if (!this.inline && !timeUpdated) {
        this.dialogOverlayClicked(null);
      }
    }
  }

  updateInputfield() {
    this.inputFormatted = '';

    // set formatted date into <input/>
    if (this.ngModel && this.date) {
      this.inputFormatted = this.format(
        this.date.clone().use(this.ngModel), this.inputFormat);
    }
  }

  // 1. open dialog
  // 2. update view
  // 3. emit events
  inputFocused($event: any) {
    const wasHidden = this.openDialog;
    this.openDialog = true;
    this.updateView();

    this.focused.emit(null);
    if (!wasHidden) {
      this.showed.emit(null);
    }
  }

  inputBlured($event: any) {
    this.blurred.emit(null);
  }

  navigateToPreviousView() {
    const ymd = this.date.clone().ymd;
    const month = ymd.month;

    ymd.month -= this.numberOfMonths;
    if (ymd.month < 1) {
      ymd.month = 12 - (this.numberOfMonths - month);
      ymd.year -= 1;
    }
    this.date.ymd = ymd;
    this.updateView();
  }

  navigateToNextView() {
    const ymd = this.date.clone().ymd;
    ymd.month += this.numberOfMonths;
    if (ymd.month > 12) {
      ymd.month %= 12;
      ymd.year += 1;
    }
    this.date.ymd = ymd;
    this.updateView();
  }

  headerClicked($event: any) {
    this.selectMonthDate(this.today);
  }

  monthDateClicked(viewDate: ViewDate) {
    this.selectMonthDate(viewDate);
  }

  // 1. remember view
  // 2. persiste date
  // 3. update selection
  // 4. update view (if inline)
  selectMonthDate(viewDate: ViewDate) {
    this.date.ymd = viewDate;
    this.updateNgModel(this.date.__date);
    this.updateSelection(viewDate, this.date.__date);
    // view will be update in next dialog open
    if (this.inline) {
      this.updateView();
    }
  }

  // 1. remember selection
  // 2. emit selection event
  // 3. update view dates metas
  updateSelection(vdate: ViewDate, date: Date) {
    this.selection = vdate;

    this.selected.emit({
      ndate: vdate ? Object.assign({}, vdate) : null,
      formatted: date ? this.format(this.date.clone().use(date), this.inputFormat) : '',
      date: date ? new Date(date) : null
    });

    this.checkViewDatesTodaySelectionRefs();
  }

  isYmdEqual(a: ViewDate, b: ViewDate) {
    // check year, month, and date for equality
    return a && b && a.year === b.year && a.month === b.month && a.date === b.date;
  }

  checkViewDatesTodaySelectionRefs() {
    this.viewMonths.forEach($ => $.dates.forEach(vdate => {
      if (this.today && this.isYmdEqual(vdate, this.today)) {
        vdate.today = true;
        this.today = vdate;
      } else {
        vdate.today = undefined;
      }

      if (this.selection
        && this.isYmdEqual(this.selection, vdate)
        && !vdate.prev && !vdate.next) {
        vdate.selected = true;
      } else {
        vdate.selected = undefined;
      }
    }));
  }

  updateView() {
    let date = this.ngModel;
    if (!date) {
      date = this.defaultDate ? new Date(this.defaultDate) : new Date();
    }

    // update the 'today' reference
    let ndate = this.date.clone().use(new Date());
    this.today = ndate.ymd;

    // persist the date and clone it
    ndate = this.date.use(date).clone();

    // update dialog title
    this.dialogTitle = this.format(ndate, this.titleFormat);

    // only if given date is out or current view's range
    if (!this.viewMonthsMin || this.viewMonthsMin.getTime() > date.getTime()
      || !this.viewMonthsMax || this.viewMonthsMax.getTime() < date.getTime()) {
      const count = this.numberOfMonths;

      if (count % 3 === 0) {
        // in case of 3,6,9,12
        // start from 1,4,7,10
        const ymd = ndate.ymd;
        for (let i = 1; i < 12; i += count) {
          if (ymd.month < i + count) {
            ymd.month = i;
            break;
          }
        }
        ymd.date = 1;
        ndate.ymd = ymd;
      }

      // store view lower bound
      this.viewMonthsMin = new Date(ndate.__date);

      const viewMonths = [];
      // generate view dates
      for (let is = 0, ie = count; is < ie; is++) {
        viewMonths.push(this.computeMonthDates(ndate));

        // move to next month
        const ymd = ndate.ymd;
        ymd.month += 1;
        if (ymd.month > 12) {
          ymd.year += 1;
          ymd.month = 1;
        }
        ymd.date = 1;
        ndate.ymd = ymd;
      }

      // store view upper bound
      // _.date is the 1st of next month
      // so deduct 24 hours from it
      this.viewMonthsMax = new Date(ndate.__date.getTime() - (24 * 60 * 60_000));

      this.viewMonths = viewMonths;

      this.checkViewDatesTodaySelectionRefs();

      this.viewUpdated.emit({
        viewMinDate: new Date(this.viewMonthsMin),
        viewMaxDate: new Date(this.viewMonthsMax)
      });
    }
  }

  computeMonthDates(ndate: NiDatetime): ViewMonth {
    let mdates: ViewDate[] = [];
    const mweekdays = [];
    const weekNumbers = [];

    const curYear = ndate.year;
    const curMonth = ndate.month;

    let localeFirstday = 0;
    let includeFrom = 0;
    let includeUntil = 0;

    if (this.datePicker && !this.monthPicker) {
      // prev month
      const prev = ndate.clone();
      const prevYmd = prev.ymd;
      prevYmd.month -= 1;
      if (prevYmd.month < 1) {
        prevYmd.month = 12;
        prevYmd.year -= 1;
      }
      prevYmd.date = 15;
      prev.ymd = prevYmd;
      const prevMonthDaysCount = prev.daysInMonth;
      for (let day = prevMonthDaysCount - 6; day <= prevMonthDaysCount; day++) {
        mdates.push({ year: prevYmd.year, month: prevYmd.month, date: day, prev: true });
      }

      // current month
      localeFirstday = this.locale.firstday;
      const weekFirstday = ndate.weeksFirstday;
      const monthDaysCount = ndate.daysInMonth;
      const monthFirstday = mdates.length;
      for (let day = 1; day <= monthDaysCount; day++) {
        mdates.push({ year: curYear, month: curMonth, date: day });
      }

      // next month
      const next = ndate.clone();
      const nextYmd = next.ymd;
      nextYmd.month += 1;
      if (nextYmd.month > 12) {
        nextYmd.month = 1;
        nextYmd.year += 1;
      }
      for (let day = 1; day < 7; day++) {
        mdates.push({ year: nextYmd.year, month: nextYmd.month, date: day, next: true });
      }

      // trim month dates
      const firstdaysDifference = this.getFirstdayDifference(localeFirstday, weekFirstday);
      includeFrom = monthFirstday - firstdaysDifference;
      const includedWeeksCount = (firstdaysDifference + monthDaysCount) <= 35 ? 5 : 6;
      includeUntil = includeFrom + (includedWeeksCount * 7);

      mdates = mdates.slice(includeFrom, includeUntil);
      const localeWeekends = this.locale.weekends;
      let lfirstday = localeFirstday;
      mdates.forEach(date => {
        date.weekend = localeWeekends.indexOf(lfirstday) >= 0;
        lfirstday = lfirstday !== 6 ? lfirstday + 1 : 0;
      });

      // add week nums
      const weeksCount = this.getWeeksCountUntilEndOf(ndate, curMonth);
      const monthFirstWeekNum = weeksCount - includedWeeksCount + 1;
      for (let week = monthFirstWeekNum; week <= weeksCount; week++) {
        weekNumbers.push(week);
      }

      // add weekday/ends
      const daysNames = this.locale.daysNameMini;
      const daysIndices = [0, 1, 2, 3, 4, 5, 6];
      const weekdays = [...daysNames.slice(localeFirstday), ...daysNames.slice(0, localeFirstday)];
      const weekdayIndices = [...daysIndices.slice(localeFirstday), ...daysIndices.slice(0, localeFirstday)];
      for (let i = 0; i < weekdays.length; i++) {
        mweekdays.push({ title: weekdays[i], weekend: this.locale.weekends.indexOf(weekdayIndices[i]) >= 0 });
      }
    }

    const title = ndate.clone();
    title.ymd = { year: curYear, month: curMonth, date: 1 };

    return {
      title: this.format(title, this.monthHeaderFormat),
      year: curYear,
      month: curMonth,
      date: 1,
      weeknums: weekNumbers,
      weekdays: mweekdays,
      dates: mdates
    };
  }

  getFirstdayDifference(localeFirstday: number, weekFirstday: number) {
    if (localeFirstday < weekFirstday) {
      return weekFirstday - localeFirstday;
    } else if (localeFirstday > weekFirstday) {
      return 7 - localeFirstday + weekFirstday;
    } else {
      return 0;
    }
  }

  getWeeksCountUntilEndOf(ndate: NiDatetime, month: number): number {
    ndate = ndate.clone();
    let firstday: number;
    let dayscount = 0;

    for (let monthI = 1; monthI <= month; monthI++) {
      ndate.ymd = { year: ndate.year, month: monthI, date: 1 };
      if (monthI === 1) {
        firstday = ndate.weeksFirstday;
      }
      dayscount += ndate.daysInMonth;
    }

    return Math.ceil((dayscount + this.getFirstdayDifference(this.locale.firstday, firstday)) / 7);
  }

  // 1. persiste date
  // 2. update selection (if necessary)
  updateTime() {
    this.updateNgModel(this.date.__date, true, true);

    // update the selection if date has changed
    if (!this.selection || !this.isYmdEqual(this.selection, this.date.ymd)) {
      this.updateSelection(this.date.ymd, this.date.__date);
    }
  }

  dialogOverlayClicked($event: any) {
    this.openDialog = false;
    this.hidded.emit(null);
  }

  // 1. clear selection
  // 2. clear date
  clearValue() {
    if (this.selection) {
      this.selection.selected = undefined;
      this.updateSelection(null, null);
    }
    this.updateNgModel(null);
  }

  // 1. set locale
  // 2. create ni-datetime
  // 3. convert selection
  // 4. update input field
  // 5. update view
  // 6. emit event
  updateLocale(locale: any, emit = true) {
    if (!locale) {
      return;
    }

    // set the locale
    const prevLocale = this.__locale;
    this.__locale = (typeof locale) === "string"
      ? Locales[locale as string] : locale;

    const prevDate = this.date;

    if (this.__locale.name === 'fa_AF' || this.__locale.name === 'fa_IR') {
      this.date = new NiJalaliDatetime();
    } else if (this.__locale.name === 'en_US') {
      this.date = new NiGregorianDatetime();
    } else {
      throw new Error('Invalid locale, Possible values (fa_AF, fa_IR, en_US)');
    }

    // convert selection to new locale
    if (this.selection) {
      const old = prevDate.clone();
      old.ymd = this.selection;
      const neo = this.date.clone().use(old.__date);

      this.updateSelection(neo.ymd, neo.__date);
    }

    this.updateInputfield();

    // force view update
    this.viewMonthsMin = null;
    this.viewMonthsMax = null;
    this.updateView();

    // and emit the event
    if (emit) {
      this.localeChange.emit(this.__locale.name);
      if (prevLocale.name !== this.__locale.name) {
        this.localeChanged.emit({
          previous: prevLocale.name,
          locale: this.__locale.name
        });
      }
    }
  }

  format(ndate: NiDatetime, format: string) {
    const formats = {
      YYYY: () => this.pad(ndate.year, 4),
      YY: () => this.pad(ndate.year, 4).substring(2),
      MMMM: () => this.locale.monthsName[ndate.month - 1],
      MMM: () => this.locale.monthsNameShort[ndate.month - 1],
      MM: () => this.pad(ndate.month, 2),
      M: () => ndate.month,
      DD: () => this.pad(ndate.date, 2),
      D: () => ndate.date,
      WWWW: () => this.locale.daysName[ndate.weekDay],
      WWW: () => this.locale.daysNameShort[ndate.weekDay],
      WW: () => this.locale.daysNameMini[ndate.weekDay],
      HH: () => this.pad(ndate.hours, 2),
      hh: () => this.pad(ndate.hours12, 2),
      H: () => ndate.hours,
      h: () => ndate.hours12,
      mm: () => this.pad(ndate.minutes, 2),
      m: () => ndate.minutes,
      ss: () => this.pad(ndate.seconds, 2),
      s: () => ndate.seconds,
      A: () => this.locale.AMPM[ndate.hours > 12 ? 1 : 0],
      a: () => this.locale.ampm[ndate.hours > 12 ? 1 : 0],
      z: () => ndate.__date.toString().substring(25, 33),
      iso: () => `${formats.YYYY()}-${formats.MM()}-${formats.DD()}${ndate.__date.toISOString().substring(10)}`
    };

    const pholders = {};
    let counter = 0;

    Object.keys(formats).sort((a, b) => b.length - a.length).forEach(key => {
      for (let index = format.indexOf(key); index >= 0; index = format.indexOf(key)) {
        const placeholder = `$[[${counter++}]]`;
        pholders[placeholder] = formats[key]();
        format = format.replace(key, placeholder);
      }
    });

    Object.keys(pholders).forEach(pholder => format = format.replace(pholder, pholders[pholder]));

    return format;
  }

  pad(num: any, limit: number): string {
    return '0'.repeat(limit - num.toString().length) + num;
  }
}

