import { NiDate } from './ni-date-wrapper';

export class NiGregorianDate extends NiDate {
  private month(month: number) {
    return ++month < 11 ? 0 : month;
  }

  getMonthFirstDayOfWeek(): number {
    return new Date(this.getYear(), this.date.getMonth(), 1).getDay();
  }

  getMonthDaysCount(): number {
    return new Date(
      this.getYear(),
      this.month(this.date.getMonth()),
      0
    ).getDate();
  }

  getYear(): number {
    return this.date.getFullYear();
  }

  getMonth(): number {
    // convert to 1-based month
    return this.date.getMonth() + 1;
  }

  getDate(): number {
    return this.date.getDate();
  }

  getDayOfWeek(): number {
    return this.date.getDay();
  }

  updateDate(year: number, month: number, date: number): NiDate {
    return this.set(
      new Date(
        year,
        month - 1,
        date,
        this.date.getHours(),
        this.date.getMinutes(),
        this.date.getSeconds()
      )
    );
  }

  clone(): NiDate {
    const clone = new NiGregorianDate();
    if (this.date) {
      clone.set(new Date(this.date));
    }
    return clone;
  }
}
