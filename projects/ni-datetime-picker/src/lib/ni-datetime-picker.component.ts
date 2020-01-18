import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NiDatetime, NiDatetimeLocale, LocaleChangeEvent, Locales } from './ni-datetime';
import { SelectEvent, ViewDate, ViewMonth, ViewUpdateEvent, SelectionMode } from './ni-datetime-picker';

@Component({
  selector: 'ni-datetime-picker',
  templateUrl: './ni-datetime-picker.component.html',
  styleUrls: ['./ni-datetime-picker.component.less']
})
export class NiDatetimePickerComponent implements OnInit {

  __value: Date | Date[];
  @Input()
  set value(value: Date | Date[]) {
    this.updateNgModel(value, false);
  }
  get value(): Date | Date[] {
    return this.__value;
  }
  @Output() valueChange = new EventEmitter<Date | Date[]>();

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

    this.computeUiElmentsWidth();
    this.updateView(true);
  }
  get monthPicker() {
    return this.__monthPicker;
  }

  __datePicker = true;
  @Input()
  set datePicker(value: boolean) {
    this.__datePicker = value;
    this.computeUiElmentsWidth();
  }
  get datePicker() {
    return this.__datePicker;
  }

  __timePicker = true;
  @Input()
  set timePicker(value: boolean) {
    this.__timePicker = value;
    this.computeUiElmentsWidth();
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
    this.computeUiElmentsWidth();
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
        clone = this.calendar.clone(),
        execute = (date: Date) =>
          formatted.push(this.format(clone.use(date), format));

      if (Array.isArray(value)) {
        value.forEach(execute);
      } else {
        execute(value);
      }

      return formatted.join(this.selectionModel === SelectionMode.multiple ? ", " : " - ");
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
    this.dialogTitle = this.getFormatted(this.__titleFormat, this.calendar.__date);
  }

  __monthHeaderFormat = 'MMMM YYYY';
  @Input()
  set monthHeaderFormat(value: string) {
    this.__monthHeaderFormat = value;
    this.viewMonths.forEach(viewMonth =>
      viewMonth.title = this.getFormatted(this.__monthHeaderFormat, viewMonth.value));
  }
  get monthHeaderFormat() {
    return this.__monthHeaderFormat;
  }

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
  set numberOfMonths(value: number) {
    this.__numberOfMonths = value;
    this.computeUiElmentsWidth();
    this.updateView(true);
  }
  get numberOfMonths(): number {
    this.computeUiElmentsWidth();
    return this.__numberOfMonths;
  }

  computeUiElmentsWidth() {
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
    this.checkViewDatesTodaySelectionRefs();
  }
  get disabledDates() {
    return this.__disabledDates;
  }

  @Input() showWeekNums = false;

  __disableWeekends = false;
  @Input()
  set disableWeekends(value: boolean) {
    this.__disableWeekends = value;
    this.checkViewDatesTodaySelectionRefs();
  }
  get disableWeekends() {
    return this.__disableWeekends;
  }

  calendar: NiDatetime;
  today: ViewDate;

  selection: ViewDate;
  __selectionModel: SelectionMode = SelectionMode.single;
  @Input()
  set selectionModel(value: SelectionMode) {
    this.__selectionModel = value;
  }
  get selectionModel() {
    return this.__selectionModel;
  }

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

  dialogTitle = '';
  viewMonthsMin: Date;
  viewMonthsMax: Date;
  viewMonths: ViewMonth[] = [];

  constructor() { }

  ngOnInit() {
    // in case value is set before component ready
    // re-set the value to trigger appropriate events
    this.updateLocale(this.locale, false);
    this.value = this.value;
    this.numberOfMonths = this.numberOfMonths;

    // open the dialog if inline
    this.openDialog = this.inline;
  }

  copy(dates: Date | Date[]): Date | Date[] {
    const clone = (date: Date) => new Date(date);

    if (Array.isArray(dates)) {
      return dates.map(clone);
    } else {
      return clone(dates);
    }
  }

  // 1. persiste date
  // 2. update input field
  // 3. emit event
  // 4. close dialog (if not inline and not time update)
  updateNgModel(date: Date | Date[], emit: boolean = true, timeUpdated = false) {
    this.__value = date;
    this.updateInputfield();

    if (emit) {
      this.valueChange.emit(this.copy(date));

      // close the dialog if not inline and time update
      if (!this.inline && !timeUpdated) {
        this.dialogOverlayClicked(null);
      }
    }
  }

  // 1. open dialog
  // 2. update view
  // 3. emit events
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
    return ($event.deltaY < 0 ? -1 : 1) * // +/-
      Math.max(1, Math.min(12, Math.round($event.deltaY / 100))); // 1-12
  }

  navByScroll(increment: number) {
    if (increment > 0) {
      this.navToNextView();
    } else {
      this.navToPreviousView();
    }
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
    if (viewDate.disabled) {
      return;
    }

    this.calendar.ymd = viewDate;
    this.updateNgModel(this.calendar.__date);
    this.updateSelection(viewDate, this.calendar.__date);
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
      formatted: date ? this.format(this.calendar.clone().use(date), this.inputFormat) : '',
      date: date ? new Date(date) : null
    });

    this.checkViewDatesTodaySelectionRefs();
  }

  isYmdEqual(a: ViewDate, b: ViewDate) {
    // check year, month, and date for equality
    return a && b && a.year === b.year && a.month === b.month && a.date === b.date;
  }

  checkViewDatesTodaySelectionRefs() {
    if (!this.calendar) {
      return;
    }

    let dummy = this.calendar;
    if (dummy) { dummy = dummy.clone(); }

    this.viewMonths.forEach($ => $.dates.forEach(viewDate => {
      // const inCurrentMonth = !viewDate.prev && !viewDate.next;

      viewDate.today = this.today && this.isYmdEqual(viewDate, this.today);
      if (viewDate.today) {
        this.today = viewDate;
      }

      // by default disabled
      viewDate.disabled = false;

      // is weekend? and is weekend disabled
      if (this.disableWeekends && viewDate.weekend) {
        viewDate.disabled = true;
      } else if (dummy) {
        // look in disabled dates
        for (const disabledDate of this.disabledDates) {
          dummy.use(disabledDate);
          if (this.isYmdEqual(dummy.ymd, viewDate)) {
            viewDate.disabled = true;
            break;
          }
        }
      }

      viewDate.selected = this.selection && this.isYmdEqual(this.selection, viewDate);
    }));
  }

  updateView(force: boolean = false) {
    if (!this.calendar) {
      // we don't have NiDatetime
      // we can't proceed
      return;
    }

    if (force) {
      this.viewMonthsMin = null;
      this.viewMonthsMax = null;
    }

    // use the selected value
    let value = this.value;
    if (!value) {
      if (this.calendar.__date) {
        // or view value
        value = this.calendar.__date;
      } else if (this.defaultDate) {
        // or the given default value
        value = new Date(this.defaultDate);
      } else {
        // or now
        value = new Date();
      }
    }

    if (!Array.isArray(value)) {
      value = [value];
    }

    // update the 'today' reference
    this.today = this.calendar.clone().use(new Date()).ymd;

    // persist the date and clone it
    const calendar = this.calendar.use(value[0]).clone();

    // update dialog title
    this.updateTitle();

    // only if given date is out or current view's range
    if (!this.viewMonthsMin || this.viewMonthsMin.getTime() > value[0].getTime()
      || !this.viewMonthsMax || this.viewMonthsMax.getTime() < value[0].getTime()) {
      const count = this.numberOfMonths;

      if (count % 3 === 0) {
        // in case of 3,6,9,12
        // start from 1,4,7,10
        const ymd = calendar.ymd;
        for (let i = 1; i < 12; i += count) {
          if (ymd.month < i + count) {
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
      for (let is = 0, ie = count; is < ie; is++) {
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

      this.viewUpdated.emit({
        viewMinDate: new Date(this.viewMonthsMin),
        viewMaxDate: new Date(this.viewMonthsMax)
      });
    }

    this.checkViewDatesTodaySelectionRefs();
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
      value: new Date(ndate.__date),
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
    this.updateNgModel(this.calendar.__date, true, true);

    // update the selection if date has changed
    if (!this.selection || !this.isYmdEqual(this.selection, this.calendar.ymd)) {
      this.updateSelection(this.calendar.ymd, this.calendar.__date);
    }
  }

  dialogOverlayClicked($event: any) {
    this.openDialog = false;
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

    let previous = this.calendar;

    // set the locale
    const prevLocale = this.__locale;
    this.__locale = (typeof locale) === "string"
      ? Locales[locale as string] : locale;

    // and initiated the date
    this.calendar = this.__locale.new();

    // convert selection to new locale
    if (previous && this.selection) {
      previous = previous.clone();
      previous.ymd = this.selection;
      const converted = this.calendar.clone().use(previous.__date);
      this.updateSelection(converted.ymd, converted.__date);
    }

    this.updateInputfield();

    this.updateView(true);

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
