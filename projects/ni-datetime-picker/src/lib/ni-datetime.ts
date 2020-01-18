import { toJalaali, toGregorian, jalaaliMonthLength } from './jalali';

class Ymd {
    year: number;
    month: number;
    date: number;
}

class Hms {
    hours: number;
    minutes: number;
    seconds: number;
    isPM: boolean;
}

/**
 * Month number should be 1-based (unlike Date class)
 */
export abstract class NiDatetime {

    __date: Date;

    use(date: Date): NiDatetime { this.__date = date; return this; }

    abstract get year(): number;
    abstract get month(): number;
    abstract get date(): number;
    abstract get daysInMonth(): number;
    abstract get weeksFirstday(): number;
    abstract get weekDay(): number;

    public set ymd(ymd: Ymd) { }
    public get ymd() { return this.__ymd(); }
    __ymd() { return { year: this.year, month: this.month, date: this.date }; }

    get hours12(): number { return this.hours > 12 ? this.hours % 12 : this.hours; }
    get hours(): number { return this.__date ? this.__date.getHours() : null; }
    set hours(hours: number) {
        this.__date.setHours(hours);
        this.use(this.__date);
    }
    get minutes(): number { return this.__date ? this.__date.getMinutes() : null; }
    set minutes(minutes: number) {
        this.__date.setMinutes(minutes);
        this.use(this.__date);
    }
    get seconds(): number { return this.__date ? this.__date.getSeconds() : null; }
    set seconds(seconds: number) {
        this.__date.setSeconds(seconds);
        this.use(this.__date);
    }

    get am() { return this.hours < 12; }
    set am(toggle: boolean) { this.hours = this.hours12 + (toggle ? 0 : 12); }

    get pm() { return !this.am; }
    set pm(toggle: boolean) { this.hours = this.hours12 + (toggle ? 12 : 0); }

    abstract clone(): NiDatetime;
}

export enum NiLocale {
    fa_AF, fa_IR, en_US
}

export interface LocaleChangeEvent {
    previous: string | NiLocale;
    locale: string | NiLocale;
}

export interface NiDatetimeLocale {
    name: string;
    new: () => NiDatetime;
    week: string;
    dir: string;
    firstday: number;
    weekends: number[];
    daysName: string[];
    daysNameShort: string[];
    daysNameMini: string[];
    monthsName: string[];
    monthsNameShort: string[];
    ampm: string[];
    AMPM: string[];
}

/**
 * Jalali Implmentation of NiDate
 */
export class NiJalaliDatetime extends NiDatetime {

    __jdate = { jy: null, jm: null, jd: null };

    use(date: Date): NiDatetime {
        this.__jdate = date ? toJalaali(date) : { jy: null, jm: null, jd: null };
        return super.use(date);
    }

    get year(): number { return this.__jdate.jy; }
    get month(): number { return this.__jdate.jm; }
    get date(): number { return this.__jdate.jd; }
    get daysInMonth(): number {
        if (this.__jdate.jy && this.__jdate.jm) {
            return jalaaliMonthLength(this.__jdate.jy, this.__jdate.jm);
        } else {
            return null;
        }
    }
    get weeksFirstday(): number {
        if (this.__jdate.jy && this.__jdate.jm) {
            const greg = toGregorian(this.__jdate.jy, this.__jdate.jm, 1);
            return new Date(greg.gy, greg.gm - 1, greg.gd).getDay();
        } else {
            return null;
        }
    }
    get weekDay(): number { return this.__date ? this.__date.getDay() : null; }

    get ymd() { return this.__ymd(); }
    set ymd(ymd: Ymd) {
        const greg = toGregorian(ymd.year, ymd.month, ymd.date);
        this.__date.setFullYear(greg.gy);
        this.__date.setMonth(greg.gm - 1);
        this.__date.setDate(greg.gd);
        this.use(this.__date);
    }

    clone(): NiDatetime {
        const clone = new NiJalaliDatetime();
        if (this.__date) {
            clone.use(new Date(this.__date));
        }
        return clone;
    }
}

/**
 * Gregorian Implmentation of NiDate
 */
export class NiGregorianDatetime extends NiDatetime {

    get year(): number { return this.__date.getFullYear(); }
    get month(): number { return this.__date.getMonth() + 1; }
    get date(): number { return this.__date.getDate(); }
    get daysInMonth(): number { return new Date(this.year, this.month, 0).getDate(); }
    get weeksFirstday(): number { return new Date(this.year, this.__date.getMonth(), 1).getDay(); }
    get weekDay(): number { return this.__date.getDay(); }

    get ymd() { return this.__ymd(); }
    set ymd(ymd: Ymd) {
        this.__date.setFullYear(ymd.year);
        this.__date.setMonth(ymd.month - 1);
        this.__date.setDate(ymd.date);
        this.use(this.__date);
    }

    clone(): NiDatetime {
        const clone = new NiGregorianDatetime();
        if (this.__date) {
            clone.use(new Date(this.__date));
        }
        return clone;
    }
}

/**
 * Default NiDate Locales
 */
export const Locales = {
    fa_AF: {
        name: 'fa_AF',
        new: () => new NiJalaliDatetime(),
        week: '#',
        dir: 'rtl',
        firstday: 6,
        weekends: [5],
        daysName: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
        daysNameShort: ['یک', 'دو', 'سه ', 'چهار', 'پنج', 'جمعه', 'شنبه'],
        daysNameMini: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        monthsName: ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'],
        monthsNameShort: ['حم', 'ثو', 'جو', 'سر', 'اس', 'سن', 'می', 'عق', 'قو', 'جد', 'دل', 'حو'],
        ampm: ['ق.ظ', 'ب.ظ'],
        AMPM: ['قبل از ظهر', 'بعد از ظهر']
    } as NiDatetimeLocale,
    fa_IR: {
        name: 'fa_IR',
        new: () => new NiJalaliDatetime(),
        week: '#',
        dir: 'rtl',
        firstday: 6,
        weekends: [5],
        daysName: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
        daysNameShort: ['یک', 'دو', 'سه ', 'چهار', 'پنج', 'جمعه', 'شنبه'],
        daysNameMini: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        monthsName: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        monthsNameShort: ['فر', 'ار', 'خر', 'تی', 'مر', 'شه', 'مه', 'آب', 'آذ', 'دی', 'به', 'اس'],
        ampm: ['ق.ظ', 'ب.ظ'],
        AMPM: ['قبل از ظهر', 'بعد از ظهر']
    } as NiDatetimeLocale,
    en_US: {
        name: 'en_US',
        new: () => new NiGregorianDatetime(),
        week: 'Wk',
        dir: 'ltr',
        firstday: 1,
        weekends: [6, 0],
        daysName: ['Sunday', 'Monday', 'Tuesday', 'Wedsday', 'Thursday', 'Friday', 'Saturday'],
        daysNameShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        daysNameMini: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthsName: ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'],
        monthsNameShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ampm: ['am', 'pm'],
        AMPM: ['AM', 'PM']
    } as NiDatetimeLocale
};
