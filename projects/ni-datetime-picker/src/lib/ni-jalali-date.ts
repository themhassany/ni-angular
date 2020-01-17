import { NiDate } from './ni-date-wrapper';
import { toJalaali, toGregorian, jalaaliMonthLength } from './ni-jalali';

export class NiJalaliDate extends NiDate {
  jdate = { jy: null, jm: null, jd: null };

  set(date: Date): NiDate {
    super.set(date);
    this.jdate = this.date
      ? toJalaali(this.date)
      : { jy: null, jm: null, jd: null };
    return this;
  }

  private month(month: number) {
    return --month < 0 ? 11 : month;
  }

  getMonthFirstDayOfWeek(): number {
    if (this.jdate.jy && this.jdate.jm) {
      const gdate = toGregorian(this.jdate.jy, this.jdate.jm, 1);
      return new Date(gdate.gy, this.month(gdate.gm), gdate.gd).getDay();
    } else {
      return null;
    }
  }

  getMonthDaysCount(): number {
    if (this.jdate.jy && this.jdate.jm) {
      return jalaaliMonthLength(this.jdate.jy, this.jdate.jm);
    } else {
      return null;
    }
  }

  getYear(): number {
    return this.jdate.jy;
  }

  getMonth(): number {
    return this.jdate.jm;
  }

  getDate(): number {
    return this.jdate.jd;
  }

  getDayOfWeek(): number {
    return this.date ? this.date.getDay() : null;
  }

  updateDate(year: number, month: number, date: number): NiDate {
    const gdate = toGregorian(year, month, date);

    return this.set(
      new Date(
        gdate.gy,
        this.month(gdate.gm),
        gdate.gd,
        this.date.getHours(),
        this.date.getMinutes(),
        this.date.getSeconds()
      )
    );
  }

  clone(): NiDate {
    const clone = new NiJalaliDate();
    if (this.date) {
      clone.set(new Date(this.date));
    }
    return clone;
  }
}
