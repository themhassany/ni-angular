/**
 * Month number should be 1-based (unlike Date class)
 */
export abstract class NiDate {

  date: Date;

  set(date: Date): NiDate {
    this.date = date;
    return this;
  }

  setToNow(): NiDate {
    return this.set(new Date());
  }

  abstract getMonthFirstDayOfWeek(): number;
  abstract getMonthDaysCount(): number;
  abstract getYear(): number;
  abstract getMonth(): number;
  abstract getDate(): number;
  abstract getDayOfWeek(): number;
  abstract updateDate(year: number, month: number, date: number): NiDate;

  getHours(): number {
    return this.date ? this.date.getHours() : null;
  }

  getMinutes(): number {
    return this.date ? this.date.getMinutes() : null;
  }

  getSeconds(): number {
    return this.date ? this.date.getSeconds() : null;
  }

  updateTime(field: 'hour' | 'minute' | 'second' | 'ampm', sign: number): NiDate {
    if (field === 'hour') {
      this.date.setHours(this.date.getHours() + sign);
    } else if (field === 'minute') {
      this.date.setMinutes(this.date.getMinutes() + sign);
    } else if (field === 'second') {
      this.date.setSeconds(this.date.getSeconds() + sign);
    } else if (field === 'ampm') {
      this.date.setHours(Math.abs(this.date.getHours() + sign * 12) % 24);
    }

    return this.set(new Date(this.date));
  }

  abstract clone(): NiDate;
}
