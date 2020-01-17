import { toJalaali, toGregorian, jalaaliMonthLength } from './jalali';

/**
 * Month number should be 1-based (unlike Date class)
 */
export abstract class NiDatetime {

    date: Date;

    set(date: Date): NiDatetime {
        this.date = date;
        return this;
    }

    setToNow(): NiDatetime {
        return this.set(new Date());
    }

    abstract getMonthFirstDayOfWeek(): number;
    abstract getMonthDaysCount(): number;
    abstract getYear(): number;
    abstract getMonth(): number;
    abstract getDate(): number;
    abstract getDayOfWeek(): number;
    abstract updateDate(year: number, month: number, date: number): NiDatetime;

    getHours(): number {
        return this.date ? this.date.getHours() : null;
    }

    getMinutes(): number {
        return this.date ? this.date.getMinutes() : null;
    }

    getSeconds(): number {
        return this.date ? this.date.getSeconds() : null;
    }

    updateTime(field: 'hour' | 'minute' | 'second' | 'ampm', sign: number): NiDatetime {
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

    abstract clone(): NiDatetime;
}

export interface NiDatetimeLocale {
    newInstance: () => NiDatetime;
    wk: string;
    dir: string;
    firstday: number;
    weekends: number[];
    daysName: string[];
    daysShortName: string[];
    daysMiniName: string[];
    monthsName: string[];
    monthsShortName: string[];
    ampm: string[];
    AMPM: string[];
}

/**
 * Jalali Implmentation of NiDate
 */
export class NiJalaliDatetime extends NiDatetime {
    jdate = { jy: null, jm: null, jd: null };

    set(date: Date): NiDatetime {
        super.set(date);
        if (this.date) { this.jdate = toJalaali(this.date); }
        /*_____*/ else { this.jdate = { jy: null, jm: null, jd: null }; }
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

    updateDate(year: number, month: number, date: number): NiDatetime {
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

    clone(): NiDatetime {
        const clone = new NiJalaliDatetime();
        if (this.date) {
            clone.set(new Date(this.date));
        }
        return clone;
    }
}

/**
 * Gregorian Implmentation of NiDate
 */
export class NiGregorianDatetime extends NiDatetime {
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

    updateDate(year: number, month: number, date: number): NiDatetime {
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

    clone(): NiDatetime {
        const clone = new NiGregorianDatetime();
        if (this.date) {
            clone.set(new Date(this.date));
        }
        return clone;
    }
}

/**
 * Default NiDate Locales
 */
export const Locales = {
    fa_AF: {
        newInstance: () => new NiJalaliDatetime(),
        wk: '#',
        dir: 'rtl',
        firstday: 6,
        weekends: [5],
        daysName: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
        daysShortName: ['یک', 'دو', 'سه ', 'چهار', 'پنج', 'جمعه', 'شنبه'],
        daysMiniName: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        monthsName: ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'],
        monthsShortName: ['حم', 'ثو', 'جو', 'سر', 'اس', 'سن', 'می', 'عق', 'قو', 'جد', 'دل', 'حو'],
        ampm: ['ق.ظ', 'ب.ظ'],
        AMPM: ['قبل از ظهر', 'بعد از ظهر']
    } as NiDatetimeLocale,
    fa_IR: {
        newInstance: () => new NiJalaliDatetime(),
        wk: '#',
        dir: 'rtl',
        firstday: 6,
        weekends: [5],
        daysName: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
        daysShortName: ['یک', 'دو', 'سه ', 'چهار', 'پنج', 'جمعه', 'شنبه'],
        daysMiniName: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        monthsName: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        monthsShortName: ['فر', 'ار', 'خر', 'تی', 'مر', 'شه', 'مه', 'آب', 'آذ', 'دی', 'به', 'اس'],
        ampm: ['ق.ظ', 'ب.ظ'],
        AMPM: ['قبل از ظهر', 'بعد از ظهر']
    } as NiDatetimeLocale,
    en_US: {
        newInstance: () => new NiGregorianDatetime(),
        wk: 'Wk',
        dir: 'ltr',
        firstday: 1,
        weekends: [6, 0],
        daysName: ['Sunday', 'Monday', 'Tuesday', 'Wedsday', 'Thursday', 'Friday', 'Saturday'],
        daysShortName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        daysMiniName: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthsName: ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShortName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ampm: ['am', 'pm'],
        AMPM: ['AM', 'PM']
    } as NiDatetimeLocale
};
