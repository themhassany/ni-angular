import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValueChange, ViewDate, ViewMonth, LocaleChangeEvent, ViewUpdateEvent } from './ni-datetime-picker';
import { Ymd, NiDatetime, NiDatetimeLocale, Locales, formatDate, padNumber } from 'ni-datetime';

@Component({
  selector: 'ni-datetime-picker',
  templateUrl: './ni-datetime-picker.component.html',
  styleUrls: ['./ni-datetime-picker.component.less']
})
export class NiDatetimePickerComponent implements OnInit {

  /*
   * attributes prefix notation
   *------------------------------
   * __ => only in component, eg: __value
   * _  => in component and view, eg: _dateOrarray(...)
   *    => public, eg: value
   */

  __value: any; // Date|Date[]
  @Input()
  set value(value: any) {
    this._setValue(value, false);

    if (this.calendar) {
      this.__updateViewDatesStates();
    }
  }
  get value(): any {
    return this.__value;
  }
  _dateORarray(value: any) {
    if (this.isSingleSelection) {
      return Array.isArray(value) && value.length ? value[0] : value;
    } else if (Array.isArray(value)) {
      return value;
    } else if (value) {
      return [value];
    } else {
      return value; // null
    }
  }
  @Output() valueChange = new EventEmitter<any>();
  @Output() valueChanged = new EventEmitter<ValueChange | ValueChange[]>();
  _setValue(value: any, emit = true) {
    this.__value = this._dateORarray(value);
    this._updateInputfield();

    if (emit && this.calendar) {
      this.valueChange.emit(this.__copy(value));

      const helpers = this.__viewDateStateHelper();

      if (!this.value) {
        this.valueChanged.emit({});
      } else if (this.isSingleSelection) {
        const vdate = helpers.calendar.use(this.value).ymd;
        this.__updateViewDateState(vdate, helpers);

        this.valueChanged.emit({
          date: new Date(this.value),
          viewDate: vdate,
          viewDateFormatted: this._getFormatted(this.inputFormat, this.value)
        });
      } else {
        const vdates = [];
        this.value.forEach((date: Date) => {
          const vdate = helpers.calendar.use(date).ymd;
          this.__updateViewDateState(vdate, helpers);
          vdates.push({
            date: new Date(date),
            viewDate: vdate,
            viewDateFormatted: this._getFormatted(this.inputFormat, date)
          });
        });
        this.valueChanged.emit(vdates);
      }
    }
  }

  // use for the view if value is null
  @Input() defaultDate: Date;

  __monthPicker = false;
  __prevNumberOfMonths = null;
  @Input()
  set monthPicker(value: boolean) {
    this.__monthPicker = value;

    // remember and switch back to previous numberOfMonths
    if (this.__monthPicker) {
      this.__prevNumberOfMonths = this.__numberOfMonths;
    } else {
      this.__numberOfMonths = this.__prevNumberOfMonths;
    }

    this.__computeUiElementsWidth();
    this.__updateView(true, false);
  }
  get monthPicker() {
    return this.__monthPicker;
  }

  __datePicker = true;
  @Input()
  set datePicker(value: boolean) {
    this.__datePicker = value;
    this.__computeUiElementsWidth();
    this.__updateView(true, false);
  }
  get datePicker() {
    return this.__datePicker;
  }

  __timePicker = true;
  @Input()
  set timePicker(value: boolean) {
    this.__timePicker = value;
    this.__computeUiElementsWidth();
    this.__updateView(true, false);
  }
  get timePicker() {
    return this.__timePicker;
  }

  __inline = true;
  @Input()
  set inline(value: boolean) {
    this.__inline = value;
    if (this.__inline) {
      this.openDialog = true;
    }
    this.__computeUiElementsWidth();
  }
  get inline() {
    return this.__inline;
  }

  @Input() enableLocaleSwitch = false;
  __locale: NiDatetimeLocale = Locales.fa_AF;
  @Output() localeChange = new EventEmitter<string>();
  @Input()
  set locale(value: any) {
    this._updateLocale(value, false);
  }
  get locale(): any {
    return this.__locale;
  }

  _getFormatted(format: string, value: any) {
    if (format && value && this.calendar) {
      const formatted = [],
        calendar = this.calendar.clone(),
        perform = (date: Date) =>
          formatted.push(formatDate(calendar.use(date), this.locale, format));

      if (Array.isArray(value)) {
        value.forEach(perform);
      } else {
        perform(value);
      }

      return formatted.join(this.selectedSeparator);
    } else {
      return '';
    }
  }

  __inputFormat = 'YYYY-MM-DD HH:mm AP';
  @Input()
  set inputFormat(value: string) {
    this.__inputFormat = value;
    this._updateInputfield();
  }
  get inputFormat() {
    return this.__inputFormat;
  }
  _updateInputfield() {
    this._inputFormatted = this._getFormatted(this.__inputFormat, this.value);
  }

  @Input() placeholder = '';

  __titleFormat = 'MMMM YYYY';
  @Input()
  set titleFormat(value: string) {
    this.__titleFormat = value;
    this._updateTitle();
  }
  get titleFormat() {
    return this.__titleFormat;
  }
  _updateTitle() {
    this._title = this._getFormatted(this.__titleFormat, this.calendar.__date);
  }

  __monthHeaderFormat = 'MMMM YYYY';
  @Input()
  set monthHeaderFormat(value: string) {
    this.__monthHeaderFormat = value;
    this._viewMonths.forEach(viewMonth => viewMonth.title
      = this._getFormatted(this.__monthHeaderFormat, viewMonth.value));
  }
  get monthHeaderFormat() {
    return this.__monthHeaderFormat;
  }

  @Output() showed = new EventEmitter<any>();
  @Output() hidded = new EventEmitter<any>();
  @Output() focused = new EventEmitter<any>();
  @Output() blurred = new EventEmitter<any>();
  @Output() viewUpdated = new EventEmitter<ViewUpdateEvent>();
  @Output() localeChanged = new EventEmitter<LocaleChangeEvent>();

  dialogWidth: string;
  monthWidth: string;

  __numberOfMonths = 1;
  @Input()
  set numberOfMonths(value: number) {
    this.__numberOfMonths = value;
    this.__computeUiElementsWidth();
    this.__updateView(true);
  }
  get numberOfMonths(): number {
    this.__computeUiElementsWidth();
    return this.__numberOfMonths;
  }

  __computeUiElementsWidth() {
    if (this.monthPicker) {
      this.dialogWidth = '250px';
      this.monthWidth = '33.333%';
      this.__numberOfMonths = 12;
    } else if (this.datePicker) {
      this.__numberOfMonths = Math.max(1, Math.min(12, this.__numberOfMonths)); // 1-12
      const columns = this.__numberOfMonths < 3 ? this.__numberOfMonths : 3;
      this.dialogWidth = `${columns * 250}px`;
      this.monthWidth = `${columns < 2 ? 100 : (columns < 3 ? 50 : 33.333)}%`;
    } else if (this.timePicker) {
      this.dialogWidth = '250px';
    }
  }

  __disabledDates: Date[] = [];
  @Input()
  set disabledDates(value: Date[]) {
    this.__disabledDates = value;
    this.__updateViewDatesStates();
  }
  get disabledDates() {
    return this.__disabledDates;
  }

  @Input() showWeekNums = false;

  __disableWeekends = false;
  @Input()
  set disableWeekends(value: boolean) {
    this.__disableWeekends = value;
    this.__updateViewDatesStates();
  }
  get disableWeekends() {
    return this.__disableWeekends;
  }

  calendar: NiDatetime;
  get _today(): Ymd {
    return this.calendar ? this.calendar.clone().use(new Date()).ymd : null;
  }

  __selectedSeparator = ', '; // ', ' for multiple | ' - ' for range
  @Input()
  set selectedSeparator(value: string) {
    this.__selectedSeparator = value;
    this.__checkSelectedSeparator();
    this._updateInputfield();
  }
  get selectedSeparator(): string {
    return this.__selectedSeparator;
  }

  __checkSelectedSeparator() {
    if (this.selectedSeparator) {
      // it already has one
    } else if (this.isMultipleSelection) {
      this.__selectedSeparator = ', ';
    } else if (this.isRangeSelection) {
      this.__selectedSeparator = ' - ';
    }
  }

  __selectionMode = 'single';
  @Input()
  set selectionMode(value: string) {
    // it should be one of these value, or 'single' by default
    if (['single', 'multiple', 'range'].indexOf(value) < 0) {
      value = 'single';
    }

    this.__selectionMode = value;

    this.__checkSelectedSeparator();

    this._setValue(this.value, false);

    // for range, truncate to min and max
    if (this.isRangeSelection && this.value.length > 2) {
      this.__value = [
        Math.min.apply(null, this.value),
        Math.max.apply(null, this.value)
      ];
    }

    this._updateInputfield();
    this.__updateViewDatesStates();
  }
  get selectionMode() {
    return this.__selectionMode;
  }
  get isSingleSelection() { return this.selectionMode === 'single'; }
  get isMultipleSelection() { return this.selectionMode === 'multiple'; }
  get isRangeSelection() { return this.selectionMode === 'range'; }

  _inputFormatted = '';

  __openDialog = false;
  set openDialog(value: boolean) {
    this.__openDialog = value;

    if (value) {
      this.__updateView();
    }

    if (value) {
      this.showed.emit({});
    } else {
      this.hidded.emit({});
    }
  }
  get openDialog() {
    return this.__openDialog;
  }

  _title = '';
  __viewMonthsMin: Date;
  __viewMonthsMax: Date;
  _viewMonths: ViewMonth[] = [];

  constructor() { }

  ngOnInit() {
    // in case value is set before component ready
    // re-set the value to trigger appropriate events
    // this.locale = this.locale;
    // this.xyz = this.xyz;
    // this.numberOfMonths = this.numberOfMonths;

    // open the dialog if inline
    // this.openDialog = this.inline;
  }

  __copy(dates: any): any {
    if (!dates) { return dates; }
    const clone = (date: Date) => new Date(date);

    if (Array.isArray(dates)) {
      return dates.map(clone);
    } else {
      return clone(dates);
    }
  }

  _inputFocused($event: any) {
    this.openDialog = true;
    this.focused.emit({});
  }

  _inputBlured($event: any) {
    this.blurred.emit({});
  }

  _navToPreviousView() {
    const ymd = this.calendar.clone().ymd;
    ymd.month -= this.numberOfMonths;
    if (ymd.month < 1) {
      ymd.month = 12 - Math.abs(ymd.month);
      ymd.year -= 1;
    }
    this.calendar.ymd = ymd;
    this.__updateView();
  }

  _navToNextView() {
    const ymd = this.calendar.clone().ymd;
    ymd.month += this.numberOfMonths;
    if (ymd.month > 12) {
      ymd.month %= 12;
      ymd.year += 1;
    }
    this.calendar.ymd = ymd;
    this.__updateView();
  }

  _scrollIncrement($event: any) {
    $event.preventDefault();
    // +/-[1-12]
    return ($event.deltaY < 0 ? -1 : 1) *
      Math.max(1, Math.min(12, Math.round($event.deltaY / 100)));
  }

  _navByScroll(increment: number) {
    if (increment > 0) {
      this._navToNextView();
    } else {
      this._navToPreviousView();
    }
  }

  _headerClicked($event: any) {
    this.calendar.ymd = this._today;
    this.__updateView();
  }

  _monthDateClicked(viewDate: ViewDate) {
    this._selectMonthDate(viewDate);
  }

  _selectMonthDate(viewDate: ViewDate) {
    if (viewDate.disabled
      || viewDate.prev
      || viewDate.next) {
      return;
    }

    if (this.isSingleSelection) {
      this.calendar.ymd = viewDate;
      this._setValue(this.calendar.__date);
    } else {
      const value = this.value ? this.value : [],
        helper = this.calendar.clone(),
        matched = value.filter((date: Date) =>
          this.__isYmdInRange(viewDate, helper.use(date).ymd));

      if (matched.length) {
        value.splice(value.indexOf(matched[0]), 1);
      } else if (value.length === 2 && this.isRangeSelection) {
        helper.ymd = viewDate;
        value.splice(0, value.length, helper.__date);
      } else {
        helper.ymd = viewDate;
        value.push(helper.__date);
      }

      this._setValue(value);
    }

    if (this.inline || !this.isSingleSelection) {
      this.__updateView();
    } else {
      this.openDialog = false;
    }
  }

  __ymdInt(ymd: Ymd) {
    return (ymd.year * 10_000) + (ymd.month * 100) + ymd.date;
  }

  __isYmdInRange(value: ViewDate, first: ViewDate, last?: ViewDate) {
    if (!value || !first) {
      return false;
    } else if (!last) {
      last = first;
    }

    return this.__ymdInt(value) >= this.__ymdInt(first)
      && this.__ymdInt(value) <= this.__ymdInt(last);
  }

  __viewDateStateHelper() {
    const calendar = this.calendar.clone(),
      value = Array.isArray(this.value) ? this.value : [this.value],
      values = value.map(date => calendar.use(date).ymd)
        .sort((a, b) => a.year - b.year || a.month - b.month || a.date - b.date);

    return {
      today: this._today,
      calendar: (calendar),
      selected: this.isRangeSelection && value.length === 2
        ? (vdate: ViewDate) => this.__isYmdInRange(vdate, values[0], values[1])
        : (vdate: ViewDate) => values.filter(each => this.__isYmdInRange(vdate, each)).length > 0
    };
  }

  __updateViewDatesStates() {
    if (!this.calendar) { return; }

    const helpers = this.__viewDateStateHelper();

    this._viewMonths.forEach(viewMonth => {
      viewMonth.dates.forEach(viewDate => {
        this.__updateViewDateState(viewDate, helpers);
      });
    });
  }

  __updateViewDateState(date: ViewDate, helpers: any) {
    date.today = this.__isYmdInRange(date, helpers.today);

    // by default disabled
    date.disabled = false;

    // is weekend? and is weekend disabled
    if (this.disableWeekends && date.weekend) {
      date.disabled = true;
    } else if (helpers.calendar) {
      // look in disabled dates
      for (const disabledDate of this.disabledDates) {
        helpers.calendar.use(disabledDate);
        if (this.__isYmdInRange(helpers.calendar.ymd, date)) {
          date.disabled = true;
          break;
        }
      }
    }

    date.selected = helpers.selected(date);
  }

  __updateView(force: boolean = false, emit = true) {
    let calendar = this.calendar;

    if (!calendar) {
      // we can't proceed if we don't have NiDatetime
      return;
    } else if (!calendar.__date) {
      calendar.use(this.defaultDate ? new Date(this.defaultDate) : new Date());
    }

    calendar = calendar.clone();

    if (force) {
      this.__viewMonthsMin = null;
      this.__viewMonthsMax = null;
    }

    // update dialog title
    this._updateTitle();

    const vmin = this.__viewMonthsMin,
      vmax = this.__viewMonthsMax,
      date = calendar.__date.getTime();

    // only if given date is out or current view's range
    if (!vmin || date < vmin.getTime() || !vmax || date > vmax.getTime()) {
      const months = this.numberOfMonths;
      if (months % 3 === 0) {
        // in case of 3,6,9,12
        // start from 1,4,7,10
        const ymd = calendar.ymd;
        for (let i = 1; i < 12; i += months) {
          if (ymd.month < i + months) {
            ymd.month = i;
            break;
          }
        }
        ymd.date = 1;
        calendar.ymd = ymd;
      }

      // store view lower bound
      this.__viewMonthsMin = new Date(calendar.__date);

      const viewMonths = [];
      // generate view dates
      for (let is = 0, ie = months; is < ie; is++) {
        viewMonths.push(this.__computeMonthDates(calendar));

        // move to next month
        const ymd = calendar.ymd;
        ymd.month += 1;
        if (ymd.month > 12) {
          ymd.year += 1;
          ymd.month = 1;
        }
        ymd.date = 1;
        calendar.ymd = ymd;
      }

      // store view upper bound
      // _.date is the 1st of next month
      // so deduct 24 hours from it
      this.__viewMonthsMax = new Date(calendar.__date.getTime() - (24 * 60 * 60_000));

      this._viewMonths = viewMonths;

      if (emit) {
        this.viewUpdated.emit({
          viewMinDate: new Date(this.__viewMonthsMin),
          viewMaxDate: new Date(this.__viewMonthsMax)
        });
      }
    }

    this.__updateViewDatesStates();
  }

  __computeMonthDates(ndate: NiDatetime): ViewMonth {
    const mweekdays = [],
      mweeknums = [],
      cyear = ndate.year,
      cmonth = ndate.month;

    let mdates: ViewDate[] = [],
      locale1stday = 0,
      datesFrom = 0,
      datesUntil = 0;

    if (this.datePicker && !this.monthPicker) {
      // prev month
      const prev = ndate.clone(),
        pymd = prev.ymd;
      pymd.month -= 1;
      if (pymd.month < 1) {
        pymd.month = 12;
        pymd.year -= 1;
      }
      pymd.date = 15;
      prev.ymd = pymd;

      for (let count = prev.daysInMonth, day = count - 6; day <= count; day++) {
        mdates.push({ year: pymd.year, month: pymd.month, date: day, prev: true });
      }

      // current month
      locale1stday = this.locale.firstday;
      const week1stday = ndate.weeksFirstday,
        daysInMonth = ndate.daysInMonth,
        month1stday = mdates.length;
      for (let day = 1; day <= daysInMonth; day++) {
        mdates.push({ year: cyear, month: cmonth, date: day });
      }

      // next month
      const next = ndate.clone(),
        nymd = next.ymd;
      nymd.month += 1;
      if (nymd.month > 12) {
        nymd.month = 1;
        nymd.year += 1;
      }
      for (let day = 1; day < 7; day++) {
        mdates.push({ year: nymd.year, month: nymd.month, date: day, next: true });
      }

      // trim month dates
      const diff = this.__getFirstdaysDiff(locale1stday, week1stday),
        includedWeeks = (diff + daysInMonth) <= 35 ? 5 : 6;
      datesFrom = month1stday - diff;
      datesUntil = datesFrom + (includedWeeks * 7);

      mdates = mdates.slice(datesFrom, datesUntil);
      const weekends = this.locale.weekends;
      let lfirstday = locale1stday;
      mdates.forEach(date => {
        date.weekend = weekends.indexOf(lfirstday) >= 0;
        lfirstday = lfirstday !== 6 ? lfirstday + 1 : 0;
      });

      // add week nums
      const weeks = this.__getNumberOfWeeksUntil(ndate, cmonth);
      for (let week = weeks - includedWeeks + 1; week <= weeks; week++) {
        mweeknums.push(week);
      }

      // add weekday/ends
      const daysNames = this.locale.daysNameMini,
        weekdays = [...daysNames.slice(locale1stday), ...daysNames.slice(0, locale1stday)],
        zero2six = [0, 1, 2, 3, 4, 5, 6],
        indices = [...zero2six.slice(locale1stday), ...zero2six.slice(0, locale1stday)];
      for (let i = 0; i < weekdays.length; i++) {
        mweekdays.push({
          title: weekdays[i],
          weekend: weekends.indexOf(indices[i]) >= 0
        });
      }
    }

    const title = ndate.clone();
    title.ymd = { year: cyear, month: cmonth, date: 1 };

    return {
      value: new Date(ndate.__date),
      title: formatDate(title, this.locale, this.monthHeaderFormat),
      year: cyear,
      month: cmonth,
      date: 1,
      weeknums: mweeknums,
      weekdays: mweekdays,
      dates: mdates
    };
  }

  __getNumberOfWeeksUntil(calendar: NiDatetime, month: number): number {
    calendar = calendar.clone();
    let firstday: number,
      dayscount = 0;

    for (let i = 1; i <= month; i++) {
      calendar.ymd = { year: calendar.year, month: i, date: 1 };
      if (i === 1) {
        firstday = calendar.weeksFirstday;
      }
      dayscount += calendar.daysInMonth;
    }

    return Math.ceil((dayscount + this.__getFirstdaysDiff(this.locale.firstday, firstday)) / 7);
  }

  __getFirstdaysDiff(locale1stday: number, week1stday: number) {
    if (locale1stday < week1stday) {
      return week1stday - locale1stday;
    } else if (locale1stday > week1stday) {
      return 7 - locale1stday + week1stday;
    } else {
      return 0;
    }
  }

  _updateTime() {
    // this.calendar.xxx is already updated in the view
    this._setValue(this.calendar.__date);
    this.__updateView();
  }

  _overlayClicked($event: any) {
    this.openDialog = false;
  }

  _pickerClicked($event: any) {
    // toggle open dialog
    this.openDialog = !this.openDialog;
  }

  _clearClicked($event: any) {
    this._setValue(null);

    if (this.inline) {
      this.__updateViewDatesStates();
    } else {
      this.openDialog = false;
    }
  }

  _updateLocale(locale: any, emit = true) {
    if (!locale) { return; }

    const prevLocale = this.__locale;

    // set the locale
    this.__locale = (typeof locale) === "string"
      ? Locales[locale as string] : locale;

    // initiate new calendar & use previous date value
    const prevCalendar = this.calendar;
    this.calendar = this.__locale.new();
    if (prevCalendar) {
      prevCalendar.use(this.calendar.__date);
    }

    this._updateInputfield();

    this.__updateView(true);

    if (emit) {
      // emit locale changed value
      this.localeChange.emit(this.__locale.name);
    }

    if (emit && prevLocale.name !== this.__locale.name) {
      // emit locale change event
      this.localeChanged.emit({ previous: prevLocale.name, locale: this.__locale.name });
    }
  }

  _pad(num: number, length: number) {
    return padNumber(num, length);
  }
}
