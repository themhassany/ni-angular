import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NiDatetime, NiJalaliDatetime, NiGregorianDatetime, NiDatetimeLocale, Locales } from './ni-datetime';
import { ChangeEvent, LocaleChangeEvent, SelectEvent, ViewDate, ViewMonth, ViewUpdateEvent } from './ni-datetime-picker';

@Component({
  selector: 'ni-datetime-picker',
  templateUrl: './ni-datetime-picker.component.html',
  styleUrls: ['./ni-datetime-picker.component.less']
})
export class NiDatetimePickerComponent implements OnInit {

  ready = false;
  $model: Date;
  today: ViewDate;
  selection: ViewDate;
  get model(): Date { return this.$model; }
  @Input() set model(date: Date) {
    if (this.ready) { this.setDate(date, false); }
    /*______*/ else { this.$model = date; }
  }
  @Output() modelChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() viewDefaultDate: Date;

  @Input() monthPicker = false;
  @Input() datePicker = true;
  @Input() timePicker = false;
  @Input() inline = false;

  @Input() closeOnSelect = false;

  @Input() localeSwitch = false;
  @Input() locale: 'fa_AF' | 'fa_IR' | 'en_US' = 'fa_AF';
  @Output() localeChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() calendarLocale: NiDatetimeLocale;
  @Input() titleFormat = 'MMMM YYYY';
  @Input() inputFormat = 'YYYY-MM-DD HH:mm AP';
  @Input() monthHeaderFormat = 'MMMM YYYY';
  @Input() placeholder = '';

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onChange = new EventEmitter<ChangeEvent>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect = new EventEmitter<SelectEvent>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onShow = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFocus = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onBlur = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onHide = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onViewUpdate = new EventEmitter<ViewUpdateEvent>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onLocaleChange = new EventEmitter<LocaleChangeEvent>();

  dialogWidth: string;
  monthWidth: string;
  $visibleMonths = 1;
  get visibleMonths(): number { return this.$visibleMonths; }
  @Input() set visibleMonths(visibleMonths: number) {
    // 1-12
    this.$visibleMonths = Math.max(0, Math.min(12, visibleMonths));

    if (this.monthPicker) {
      this.dialogWidth = '250px';
      this.monthWidth = '33.333333%';
    } else {
      const columns = this.$visibleMonths < 3 ? this.$visibleMonths : 3;
      this.dialogWidth = `${columns * 250}px`;
      this.monthWidth = `${columns < 2 ? 100 : (columns < 3 ? 50 : 33.333333)}%`;
    }
  }

  nidate: NiDatetime;
  inputFormatted = '';

  $openDialog = false;
  get openDialog(): boolean { return this.$openDialog; }
  @Input() set openDialog(open: boolean) {
    this.$openDialog = open;
    if (this.ready) {
      this.openDialogChange.emit(this.$openDialog);
    }
  }
  @Output() openDialogChange = new EventEmitter<boolean>();
  dialogTitle = '';
  viewMonthsMin: Date;
  viewMonthsMax: Date;
  viewMonths: ViewMonth[] = [];

  constructor() { }

  ngOnInit() {
    // set locale and date wrapper
    this.changeLocale(this.locale, false);

    this.ready = true;
    // in case value is set before component ready
    // re-set the value to trigger appropriate events
    this.model = this.$model;

    this.visibleMonths = this.$visibleMonths;

    // open the dialog if inline
    if (this.inline) {
      this.openDialog = true;
    }
  }

  setDate(date: Date, emit: boolean = true) {
    // emit the value
    if (emit) {
      this.$model = date ? new Date(date) : null;

      this.modelChange.emit(date);
      this.onChange.emit({
        formatted: date ? this.format(
          this.nidate.clone().set(date),
          this.inputFormat
        ) : '',
        date: this.$model
      });
    }

    if (date) {
      this.nidate.set(date);
      // set formatted date into <input/>
      this.inputFormatted = this.format(this.nidate, this.inputFormat);
    } else {
      this.inputFormatted = '';
    }

    // update the view
    this.updateView(date);

    if (emit && !this.inline && this.closeOnSelect) {
      this.dialogOverlayClicked(null);
    }
  }

  updateView(date: Date) {
    if (!date) {
      // then use now
      date = this.viewDefaultDate ? new Date(this.viewDefaultDate) : new Date();
    }

    // update the 'today' reference
    let _ = this.nidate.clone().set(new Date());
    this.today = { year: _.getYear(), month: _.getMonth(), date: _.getDate() };

    // persist the date and clone it
    _ = this.nidate.set(date).clone();

    // update dialog title
    this.dialogTitle = this.format(_, this.titleFormat);

    // only if given date is out or current view's range
    if (!this.viewMonthsMin || this.viewMonthsMin.getTime() > date.getTime()
      || !this.viewMonthsMax || this.viewMonthsMax.getTime() < date.getTime()) {
      const count = this.visibleMonths;

      if (count % 3 === 0) {
        // in case of 3,6,9,12
        // start from 1,4,7,10
        let month = _.getMonth();
        for (let i = 1; i < 12; i += count) {
          if (month < i + count) {
            month = i;
            break;
          }
        }

        _.updateDate(_.getYear(), month, 1);
      }

      // store view lower bound
      this.viewMonthsMin = new Date(_.date);

      const viewMonths = [];
      // generate view dates
      for (let is = 0, ie = count; is < ie; is++) {
        viewMonths.push(this.computeMonthDates(_));

        // move to next month
        let year = _.getYear();
        let month = _.getMonth() + 1;
        if (month > 12) {
          year += 1;
          month = 1;
        }
        _.updateDate(year, month, 1);
      }

      // store view upper bound
      // _.date is the 1st of next month
      // so deduct 24 hours from it
      this.viewMonthsMax = new Date(_.date.getTime() - (24 * 60 * 60_000));

      this.viewMonths = viewMonths;

      this.checkViewDatesTodaySelectionRefs();

      this.onViewUpdate.emit({
        viewMinDate: new Date(this.viewMonthsMin),
        viewMaxDate: new Date(this.viewMonthsMax)
      });
    }
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

  updateTime(field: 'hour' | 'minute' | 'second' | 'ampm', sign: number) {
    const _ = this.nidate.updateTime(field, sign);
    const updated = { year: _.getYear(), month: _.getMonth(), date: _.getDate() };

    // updating time should not close the dialog
    const oldValue = this.closeOnSelect;
    this.closeOnSelect = false;

    this.setDate(_.date);

    this.closeOnSelect = oldValue;

    // update the selection if date has changed
    if (!this.selection || !this.isYmdEqual(this.selection, updated)) {
      this.setSelection(updated, _.date);
      this.checkViewDatesTodaySelectionRefs();
    }
  }

  inputFocused($event: any) {
    const wasHidden = this.openDialog;
    this.openDialog = true;
    this.updateView(this.$model);

    this.onFocus.emit(null);
    if (!wasHidden) {
      this.onShow.emit(null);
    }
  }

  inputBlured($event: any) {
    this.onBlur.emit(null);
  }

  dialogOverlayClicked($event: any) {
    this.openDialog = false;
    this.onHide.emit(null);
  }

  headerClicked($event: any) {
    this.selectMonthDate(this.today);
  }

  navigateTo(direction: 'backward' | 'forward') {
    if (direction === 'backward') {
      this.navigateToPreviousView();
    } else {
      this.navigateToNextView();
    }
  }

  navigateToPreviousView() {
    const _ = this.nidate.clone();
    let year = _.getYear();
    let month = _.getMonth() - this.visibleMonths;
    if (month < 1) {
      month = 12 - (this.visibleMonths - _.getMonth());
      year -= 1;
    }
    _.updateDate(year, month, _.getDate());
    this.updateView(_.date);
  }

  navigateToNextView() {
    const _ = this.nidate.clone();
    let year = _.getYear();
    let month = _.getMonth() + this.visibleMonths;
    if (month > 12) {
      month %= 12;
      year += 1;
    }
    _.updateDate(year, month, _.getDate());
    this.updateView(_.date);
  }

  monthDateClicked(viewDate: ViewDate) {
    this.selectMonthDate(viewDate);
  }

  selectMonthDate(viewDate: ViewDate) {
    const _ = this.nidate.updateDate(viewDate.year, viewDate.month, viewDate.date);

    this.setSelection(viewDate, _.date);
    this.checkViewDatesTodaySelectionRefs();

    this.setDate(_.date);
  }

  pad(num: any, limit: number): string {
    return '0'.repeat(limit - num.toString().length) + num;
  }

  format(_: NiDatetime, format: string) {
    const locale = this.calendarLocale;

    const formats = {
      YYYY: () => this.pad(_.getYear(), 4),
      YY: () => this.pad(_.getYear(), 4).substring(2),
      MMMM: () => locale.monthsName[_.getMonth() - 1],
      MMM: () => locale.monthsShortName[_.getMonth() - 1],
      MM: () => this.pad(_.getMonth(), 2),
      M: () => _.getMonth(),
      DD: () => this.pad(_.getDate(), 2),
      D: () => _.getDate(),
      WWWW: () => locale.daysName[_.getDayOfWeek()],
      WWW: () => locale.daysShortName[_.getDayOfWeek()],
      WW: () => locale.daysMiniName[_.getDayOfWeek()],
      HH: () => this.pad(_.getHours(), 2),
      hh: () => this.pad(_.getHours() % 12 || 12, 2),
      H: () => _.getHours(),
      h: () => _.getHours() % 12 || 12,
      mm: () => this.pad(_.getMinutes(), 2),
      m: () => _.getMinutes(),
      ss: () => this.pad(_.getSeconds(), 2),
      s: () => _.getSeconds(),
      A: () => locale.ampm[_.getHours() > 12 ? 1 : 0].toUpperCase(),
      a: () => locale.ampm[_.getHours() > 12 ? 1 : 0].toLowerCase(),
      z: () => _.date.toString().substring(25, 33),
      iso: () => `${formats.YYYY()}-${formats.MM()}-${formats.DD()}${_.date.toISOString().substring(10)}`
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

  computeMonthDates(_: NiDatetime): ViewMonth {
    const locale = this.calendarLocale;
    let mdates: ViewDate[] = [];
    const mweekdays = [];
    const weekNumbers = [];

    const curYear = _.getYear();
    const curMonth = _.getMonth();

    let localeFirstday = 0;
    let includeFrom = 0;
    let includeUntil = 0;

    if (this.datePicker && !this.monthPicker) {
      // prev month
      const prev = _.clone();
      let prevYear = prev.getYear();
      let prevMonth = prev.getMonth() - 1;
      if (prevMonth < 1) {
        prevMonth = 12;
        prevYear -= 1;
      }
      prev.updateDate(prevYear, prevMonth, 15);
      const prevMonthDaysCount = prev.getMonthDaysCount();
      for (let day = prevMonthDaysCount - 6; day <= prevMonthDaysCount; day++) {
        mdates.push({ year: prevYear, month: prevMonth, date: day, prev: true });
      }

      // current month
      localeFirstday = locale.firstday;
      const weekFirstday = _.getMonthFirstDayOfWeek();
      const monthDaysCount = _.getMonthDaysCount();
      const monthFirstday = mdates.length;
      for (let day = 1; day <= monthDaysCount; day++) {
        mdates.push({ year: curYear, month: curMonth, date: day });
      }

      // next month
      const next = _.clone();
      let nextYear = next.getYear();
      let nextMonth = next.getMonth() + 1;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
      for (let day = 1; day < 7; day++) {
        mdates.push({ year: nextYear, month: nextMonth, date: day, next: true });
      }

      // trim month dates
      const firstdaysDifference = this.getFirstdayDifference(localeFirstday, weekFirstday);
      includeFrom = monthFirstday - firstdaysDifference;
      const includedWeeksCount = (firstdaysDifference + monthDaysCount) <= 35 ? 5 : 6;
      includeUntil = includeFrom + (includedWeeksCount * 7);

      mdates = mdates.slice(includeFrom, includeUntil);
      const localeWeekends = this.calendarLocale.weekends;
      let lfirstday = localeFirstday;
      mdates.forEach(date => {
        date.weekend = localeWeekends.indexOf(lfirstday) >= 0;
        lfirstday = lfirstday !== 6 ? lfirstday + 1 : 0;
      });

      // add week nums
      const weeksCount = this.getWeeksCountUntilEndOf(_, curMonth);
      const monthFirstWeekNum = weeksCount - includedWeeksCount + 1;
      for (let week = monthFirstWeekNum; week <= weeksCount; week++) {
        weekNumbers.push(week);
      }

      // add weekday/ends
      const daysNames = locale.daysMiniName;
      const daysIndices = [0, 1, 2, 3, 4, 5, 6];
      const weekdays = [...daysNames.slice(localeFirstday), ...daysNames.slice(0, localeFirstday)];
      const weekdayIndices = [...daysIndices.slice(localeFirstday), ...daysIndices.slice(0, localeFirstday)];
      for (let i = 0; i < weekdays.length; i++) {
        mweekdays.push({ title: weekdays[i], weekend: this.calendarLocale.weekends.indexOf(weekdayIndices[i]) >= 0 });
      }
    }

    return {
      title: this.format(
        _.clone().updateDate(curYear, curMonth, 1),
        this.monthHeaderFormat
      ),
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

  getWeeksCountUntilEndOf(_: NiDatetime, month: number): number {
    _ = _.clone();
    const year = _.getYear();
    const localeFirstday = this.calendarLocale.firstday;
    let firstday: number;
    let dayscount = 0;

    for (let m = 1; m <= month; m++) {
      _.updateDate(year, m, 1);
      if (m === 1) {
        firstday = _.getMonthFirstDayOfWeek();
      }
      dayscount += _.getMonthDaysCount();
    }

    return Math.ceil((dayscount + this.getFirstdayDifference(localeFirstday, firstday)) / 7);
  }

  clearValue() {
    if (this.selection) {
      this.selection.selected = undefined;
      this.setSelection(null, null);
    }
    this.setDate(null);
  }

  changeLocale(locale: 'fa_AF' | 'fa_IR' | 'en_US', update = true) {
    const prevNiDate = this.nidate;
    const prevCloseOnSelect = this.closeOnSelect;

    // don't close when locale is changing
    this.closeOnSelect = false;

    if (locale === 'fa_AF' || locale === 'fa_IR') {
      this.nidate = new NiJalaliDatetime();
    } else if (locale === 'en_US') {
      this.nidate = new NiGregorianDatetime();
    } else {
      throw new Error('Invalid locale, Possible values (fa_AF, fa_IR, en_US)');
    }

    this.calendarLocale = Locales[locale];

    if (this.selection && this.$model) {
      this.convertSelection(prevNiDate);
    }

    // force view update
    this.viewMonthsMin = null;
    this.viewMonthsMax = null;

    this.setDate(this.$model, false);

    const previousLocale = this.locale;
    this.localeChange.emit(this.locale = locale);
    if (previousLocale !== this.locale) {
      this.onLocaleChange.emit({ previous: previousLocale, locale: this.locale });
    }

    this.closeOnSelect = prevCloseOnSelect;
  }

  convertSelection(prevNiDate: NiDatetime) {
    const oldSelection = prevNiDate.clone().updateDate(
      this.selection.year, this.selection.month, this.selection.date);
    const newSelection = this.nidate.clone().set(oldSelection.date);

    this.setSelection({
      year: newSelection.getYear(),
      month: newSelection.getMonth(),
      date: newSelection.getDate()
    }, newSelection.date);
  }

  setSelection(ndate: ViewDate, date: Date) {
    this.selection = ndate;
    this.onSelect.emit({
      ndate: ndate ? {
        year: ndate.year,
        month: ndate.month,
        date: ndate.date,
        today: ndate.today,
        weekend: ndate.weekend,
        prev: ndate.prev,
        next: ndate.next,
        selected: ndate.selected
      } : null,
      date: date ? new Date(date) : null
    });
  }
}

