import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ymd, NiDatetime, NiDatetimeLocale, LocaleChangeEvent, Locales } from './ni-datetime';
import { ValueChange, ViewDate, ViewMonth, ViewUpdateEvent } from './ni-datetime-picker';

@Component({
  selector: 'ni-datetime-picker',
  templateUrl: './ni-datetime-picker.component.html',
  styleUrls: ['./ni-datetime-picker.component.less']
})
export class NiDatetimePickerComponent implements OnInit {

  MULTI_SELECTION_SEPARATOR = ", ";
  RANGE_SELECTION_SEPARATOR = " - ";

  __value: Date | Date[];
  @Input()
  set value(value: Date | Date[]) {
    this.__value = value;

    if (this.calendar) {
      this.updateInputfield();
      this.updateViewDatesStates();
    }
  }
  get value(): Date | Date[] {
    return this.__value;
  }
  @Output() valueChange = new EventEmitter<Date | Date[]>();
  @Output() valueChanged = new EventEmitter<ValueChange | ValueChange[]>();
  set emittingValue(value: Date | Date[]) {
    this.__value = value;

    if (this.calendar) {
      this.updateInputfield();

      this.valueChange.emit(this.copy(value));

      const helpers = this.__viewDateStateHelper();

      if (this.isSingleSelection) {
        const single = this.__value as Date,
          viewDate = helpers.calendar.use(single).ymd;
        this.__updateViewDateState(viewDate, helpers);

        this.valueChanged.emit({ date: new Date(single), viewDate: (viewDate) });
      } else {
        const multiple = this.__value as Date[],
          viewDates = [];
        multiple.forEach(date => {
          const viewDate = helpers.calendar.use(date).ymd;
          this.__updateViewDateState(viewDate, helpers);
          viewDates.push({ date: new Date(date), viewDate: (viewDate) });
        });
        this.valueChanged.emit(viewDates);
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

    this.computeUiElementsWidth();
    this.updateView(true, false);
  }
  get monthPicker() {
    return this.__monthPicker;
  }

  __datePicker = true;
  @Input()
  set datePicker(value: boolean) {
    this.__datePicker = value;
    this.computeUiElementsWidth();
    this.updateView(true, false);
  }
  get datePicker() {
    return this.__datePicker;
  }

  __timePicker = true;
  @Input()
  set timePicker(value: boolean) {
    this.__timePicker = value;
    this.computeUiElementsWidth();
    this.updateView(true, false);
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
    this.computeUiElementsWidth();
  }
  get inline() {
    return this.__inline;
  }

  @Input() enableLocaleSwitch = false;
  __locale: NiDatetimeLocale = Locales.fa_AF;
  @Output() localeChange = new EventEmitter<string>();
  @Input()
  set locale(value: any) {
    this.updateLocale(value, false);
  }
  get locale(): any {
    return this.__locale;
  }

  getFormatted(format: string, value: Date | Date[]) {
    if (this.calendar && value && format) {
      const formatted = [],
        calendar = this.calendar.clone(),
        execute = (date: Date) =>
          formatted.push(this.format(calendar.use(date), format));

      if (Array.isArray(value)) {
        value.forEach(execute);
      } else {
        execute(value);
      }

      return formatted.join(
        this.isMultipleSelection
          ? this.MULTI_SELECTION_SEPARATOR
          : this.RANGE_SELECTION_SEPARATOR);
    } else {
      return '';
    }
  }

  __inputFormat = 'YYYY-MM-DD HH:mm AP';
  @Input()
  set inputFormat(value: string) {
    this.__inputFormat = value;
    this.updateInputfield();
  }
  get inputFormat() {
    return this.__inputFormat;
  }
  updateInputfield() {
    this.inputFormatted = this.getFormatted(this.__inputFormat, this.value);
  }

  @Input() placeholder = '';

  __titleFormat = 'MMMM YYYY';
  @Input()
  set titleFormat(value: string) {
    this.__titleFormat = value;
    this.updateTitle();
  }
  get titleFormat() {
    return this.__titleFormat;
  }
  updateTitle() {
    this.title = this.getFormatted(this.__titleFormat, this.calendar.__date);
  }

  __monthHeaderFormat = 'MMMM YYYY';
  @Input()
  set monthHeaderFormat(value: string) {
    this.__monthHeaderFormat = value;
    this.viewMonths.forEach(viewMonth => viewMonth.title
      = this.getFormatted(this.__monthHeaderFormat, viewMonth.value));
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
    this.computeUiElementsWidth();
    this.updateView(true);
  }
  get numberOfMonths(): number {
    this.computeUiElementsWidth();
    return this.__numberOfMonths;
  }

  computeUiElementsWidth() {
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
    this.updateViewDatesStates();
  }
  get disabledDates() {
    return this.__disabledDates;
  }

  @Input() showWeekNums = false;

  __disableWeekends = false;
  @Input()
  set disableWeekends(value: boolean) {
    this.__disableWeekends = value;
    this.updateViewDatesStates();
  }
  get disableWeekends() {
    return this.__disableWeekends;
  }

  calendar: NiDatetime;
  get today(): Ymd {
    return this.calendar ? this.calendar.clone().use(new Date()).ymd : null;
  }

  __selectionMode = 'single';
  @Input()
  set selectionMode(value: string) {
    // it should be one of these value, or 'single' by default
    if (['single', 'multiple', 'range'].indexOf(value) < 0) {
      value = 'single';
    }

    this.__selectionMode = value;

    if (this.isSingleSelection && this.value) {
      // convert [value] => value
      this.__value = this.value[0];
    } else if (!Array.isArray(this.value)) {
      // convert value => [value]
      this.__value = [this.value];
    } else if (this.isRangeSelection && this.value.length > 2) {
      // for range, truncate to min and max
      this.__value = [
        Math.min.apply(null, this.value),
        Math.max.apply(null, this.value)
      ];
    }

    this.updateViewDatesStates();
  }
  get selectionMode() {
    return this.__selectionMode;
  }
  get isSingleSelection() { return this.selectionMode === 'single'; }
  get isMultipleSelection() { return this.selectionMode === 'multiple'; }
  get isRangeSelection() { return this.selectionMode === 'range'; }

  inputFormatted = '';

  __openDialog = false;
  set openDialog(value: boolean) {
    this.__openDialog = value;

    if (value) {
      this.updateView();
    }

    if (value) {
      this.showed.emit(null);
    } else {
      this.hidded.emit(null);
    }
  }
  get openDialog() {
    return this.__openDialog;
  }

  title = '';
  viewMonthsMin: Date;
  viewMonthsMax: Date;
  viewMonths: ViewMonth[] = [];

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

  copy(dates: Date | Date[]): Date | Date[] {
    const clone = (date: Date) => new Date(date);

    if (Array.isArray(dates)) {
      return dates.map(clone);
    } else {
      return clone(dates);
    }
  }

  inputFocused($event: any) {
    this.openDialog = true;
    this.focused.emit(null);
  }

  inputBlured($event: any) {
    this.blurred.emit(null);
  }

  navToPreviousView() {
    const ymd = this.calendar.clone().ymd;
    ymd.month -= this.numberOfMonths;
    if (ymd.month < 1) {
      ymd.month = 12 - Math.abs(ymd.month);
      ymd.year -= 1;
    }
    this.calendar.ymd = ymd;
    this.updateView();
  }

  navToNextView() {
    const ymd = this.calendar.clone().ymd;
    ymd.month += this.numberOfMonths;
    if (ymd.month > 12) {
      ymd.month %= 12;
      ymd.year += 1;
    }
    this.calendar.ymd = ymd;
    this.updateView();
  }

  scrollIncrement($event: any) {
    $event.preventDefault();
    // +/-[1-12]
    return ($event.deltaY < 0 ? -1 : 1) *
      Math.max(1, Math.min(12, Math.round($event.deltaY / 100)));
  }

  navByScroll(increment: number) {
    if (increment > 0) {
      this.navToNextView();
    } else {
      this.navToPreviousView();
    }
  }

  headerClicked($event: any) {
    this.calendar.ymd = this.today;
    this.updateView();
  }

  monthDateClicked(viewDate: ViewDate) {
    this.selectMonthDate(viewDate);
  }

  selectMonthDate(viewDate: ViewDate) {
    if (viewDate.disabled) { return; }

    if (this.isSingleSelection) {
      this.calendar.ymd = viewDate;
      this.emittingValue = this.calendar.__date;
    } else {
      const value = this.value as Date[],
        helper = this.calendar.clone(),
        matched = value.filter(date => this.isYmdInRange(viewDate, helper.use(date).ymd));

      if (matched.length) {
        value.splice(value.indexOf(matched[0]), 1);
      } else if (value.length === 2 && this.isRangeSelection) {
        helper.ymd = viewDate;
        value.splice(0, value.length, helper.__date);
      } else {
        helper.ymd = viewDate;
        value.push(helper.__date);
      }

      this.emittingValue = value;
    }

    if (this.inline) {
      this.updateView();
    } else {
      this.openDialog = false;
    }
  }

  __ymdInt(ymd: Ymd) {
    return (ymd.year * 10_000) + (ymd.month * 100) + ymd.date;
  }

  isYmdInRange(value: ViewDate, first: ViewDate, last?: ViewDate) {
    if (!value || !first) {
      return false;
    } else if (!last) {
      last = first;
    }

    return this.__ymdInt(value) >= this.__ymdInt(first)
      && this.__ymdInt(value) <= this.__ymdInt(last);
  }

  __viewDateStateHelper() {
    const calendar = this.calendar.clone();
    let isSelected = null;

    const values = [];
    ((this.isSingleSelection ? [this.value] : this.value) as Date[])
      .forEach(date => values.push(calendar.use(date).ymd));
    values.sort((a, b) => a.year - b.year || a.month - b.month || a.date - b.date);
    if (this.isRangeSelection && (this.value as Date[]).length === 2) {
      isSelected = (viewDate: ViewDate) => this.isYmdInRange(viewDate, values[0], values[1]);
    } else {
      isSelected = (viewDate: ViewDate) =>
        values.filter(value => this.isYmdInRange(viewDate, value)).length > 0;
    }

    return {
      today: this.today,
      calendar: (calendar),
      selected: isSelected
    };
  }

  updateViewDatesStates() {
    if (!this.calendar) { return; }

    const helpers = this.__viewDateStateHelper();

    this.viewMonths.forEach(viewMonth => {
      viewMonth.dates.forEach(viewDate => {
        this.__updateViewDateState(viewDate, helpers);
      });
    });
  }

  __updateViewDateState(date: ViewDate, helpers: any) {
    date.today = this.isYmdInRange(date, helpers.today);

    // by default disabled
    date.disabled = false;

    // is weekend? and is weekend disabled
    if (this.disableWeekends && date.weekend) {
      date.disabled = true;
    } else if (helpers.calendar) {
      // look in disabled dates
      for (const disabledDate of this.disabledDates) {
        helpers.calendar.use(disabledDate);
        if (this.isYmdInRange(helpers.calendar.ymd, date)) {
          date.disabled = true;
          break;
        }
      }
    }

    date.selected = helpers.selected(date);
  }

  updateView(force: boolean = false, emit = true) {
    let calendar = this.calendar;

    if (!calendar) {
      // we can't proceed if we don't have NiDatetime
      return;
    } else if (!calendar.__date) {
      calendar.use(this.defaultDate ? new Date(this.defaultDate) : new Date());
    }

    calendar = calendar.clone();

    if (force) {
      this.viewMonthsMin = null;
      this.viewMonthsMax = null;
    }

    // update dialog title
    this.updateTitle();

    const vmin = this.viewMonthsMin,
      vmax = this.viewMonthsMax,
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
      this.viewMonthsMin = new Date(calendar.__date);

      const viewMonths = [];
      // generate view dates
      for (let is = 0, ie = months; is < ie; is++) {
        viewMonths.push(this.computeMonthDates(calendar));

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
      this.viewMonthsMax = new Date(calendar.__date.getTime() - (24 * 60 * 60_000));

      this.viewMonths = viewMonths;

      if (emit) {
        this.viewUpdated.emit({
          viewMinDate: new Date(this.viewMonthsMin),
          viewMaxDate: new Date(this.viewMonthsMax)
        });
      }
    }

    this.updateViewDatesStates();
  }

  computeMonthDates(ndate: NiDatetime): ViewMonth {
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
      const diff = this.getFirstdaysDiff(locale1stday, week1stday),
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
      const weeks = this.getNumberOfWeeksUntil(ndate, cmonth);
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
      title: this.format(title, this.monthHeaderFormat),
      year: cyear,
      month: cmonth,
      date: 1,
      weeknums: mweeknums,
      weekdays: mweekdays,
      dates: mdates
    };
  }

  getNumberOfWeeksUntil(calendar: NiDatetime, month: number): number {
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

    return Math.ceil((dayscount + this.getFirstdaysDiff(this.locale.firstday, firstday)) / 7);
  }

  getFirstdaysDiff(locale1stday: number, week1stday: number) {
    if (locale1stday < week1stday) {
      return week1stday - locale1stday;
    } else if (locale1stday > week1stday) {
      return 7 - locale1stday + week1stday;
    } else {
      return 0;
    }
  }

  updateTime() {
    // this.calendar.xxx is already updated in the view
    this.emittingValue = this.calendar.__date;
    this.updateView();
  }

  overlayClicked($event: any) {
    this.openDialog = false;
  }

  pickerClicked($event: any) {
    // toggle open dialog
    this.openDialog = !this.openDialog;
  }

  clearClicked() {
    this.emittingValue = null;

    if (this.inline) {
      this.updateViewDatesStates();
    } else {
      this.openDialog = false;
    }
  }

  updateLocale(locale: any, emit = true) {
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

    this.updateInputfield();

    this.updateView(true);

    if (emit) {
      // emit locale changed value
      this.localeChange.emit(this.__locale.name);
    }

    if (emit && prevLocale.name !== this.__locale.name) {
      // emit locale change event
      this.localeChanged.emit({ previous: prevLocale.name, locale: this.__locale.name });
    }
  }

  format(calendar: NiDatetime, format: string) {
    const formats = {
      YYYY: () => this.pad(calendar.year, 4),
      YY: () => this.pad(calendar.year, 4).substring(2),
      MMMM: () => this.locale.monthsName[calendar.month - 1],
      MMM: () => this.locale.monthsNameShort[calendar.month - 1],
      MM: () => this.pad(calendar.month, 2),
      M: () => calendar.month,
      DD: () => this.pad(calendar.date, 2),
      D: () => calendar.date,
      WWWW: () => this.locale.daysName[calendar.weekDay],
      WWW: () => this.locale.daysNameShort[calendar.weekDay],
      WW: () => this.locale.daysNameMini[calendar.weekDay],
      HH: () => this.pad(calendar.hours, 2),
      hh: () => this.pad(calendar.hours12, 2),
      H: () => calendar.hours,
      h: () => calendar.hours12,
      mm: () => this.pad(calendar.minutes, 2),
      m: () => calendar.minutes,
      ss: () => this.pad(calendar.seconds, 2),
      s: () => calendar.seconds,
      A: () => this.locale.AMPM[calendar.hours > 12 ? 1 : 0],
      a: () => this.locale.ampm[calendar.hours > 12 ? 1 : 0],
      z: () => calendar.__date.toString().substring(25, 33),
      iso: () => `${formats.YYYY()}-${formats.MM()}-${formats.DD()}${calendar.__date.toISOString().substring(10)}`
    };

    const placeholders = {};
    let counter = 0;

    Object.keys(formats).sort((a, b) => b.length - a.length).forEach(key => {
      for (let i = format.indexOf(key); i >= 0; i = format.indexOf(key)) {
        const placeholder = `$[[${counter++}]]`;
        placeholders[placeholder] = formats[key]();
        format = format.replace(key, placeholder);
      }
    });

    Object.keys(placeholders).forEach(pholder =>
      format = format.replace(pholder, placeholders[pholder]));

    return format;
  }

  pad(num: any, limit: number): string {
    return '0'.repeat(limit - num.toString().length) + num;
  }
}
