import { toJalaali, toGregorian, jalaaliMonthLength } from './jalali';
import { greg_to_islamic, islamic_to_greg, days_in_month } from './islamic';

export class Ymd {
    year: number;
    month: number;
    date: number;
}

export class Hms {
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

    constructor(date?: Date) {
        this.use(date);
    }

    use(date: Date): NiDatetime {
        this.__date = date ? new Date(date) : date;
        return this;
    }

    abstract get year(): number;
    abstract get month(): number;
    abstract get date(): number;
    abstract get daysInMonth(): number;
    abstract get weeksFirstday(): number;
    abstract get weekDay(): number;

    set ymd(ymd: Ymd) { }
    get ymd(): Ymd { return this.__ymd(); }
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

    get am(): boolean { return this.hours < 12; }
    set am(toggle: boolean) { this.hours = this.hours12 + (toggle ? 0 : 12); }

    get pm(): boolean { return !this.am; }
    set pm(toggle: boolean) { this.hours = this.hours12 + (toggle ? 12 : 0); }

    abstract clone(): NiDatetime;
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
    today: string;
    clear: string;
}

/**
 * Islamic Implemendation of NiDate
 */
export class NiIslamicDatetime extends NiDatetime {

    __idate = { iy: null, im: null, id: null };

    constructor(date?: Date) {
        super(date);
        this.use(date);
    }

    use(date: Date): NiDatetime {
        this.__idate = date ? greg_to_islamic(date) : { iy: null, im: null, id: null };
        return super.use(date);
    }

    get year(): number { return this.__idate.iy; }
    get month(): number { return this.__idate.im; }
    get date(): number { return this.__idate.id; }
    get daysInMonth(): number {
        if (this.__idate.iy && this.__idate.im) {
            return days_in_month(this.__idate.iy, this.__idate.im);
        } else {
            return null;
        }
    }
    get weeksFirstday(): number {
        if (this.__idate.iy && this.__idate.im) {
            const greg = islamic_to_greg({ iy: this.__idate.iy, im: this.__idate.im, id: 1 });
            return new Date(greg.gy, greg.gm - 1, greg.gd).getDay();
        } else {
            return null;
        }
    }
    get weekDay(): number { return this.__date ? this.__date.getDay() : null; }

    get ymd() { return this.__ymd(); }
    set ymd(ymd: Ymd) {
        const greg = islamic_to_greg({ iy: ymd.year, im: ymd.month, id: ymd.date });
        this.use(new Date(greg.gy, greg.gm - 1, greg.gd, 0, 0, 0));
    }

    clone(): NiDatetime {
        const clone = new NiIslamicDatetime();
        if (this.__date) {
            clone.use(new Date(this.__date));
        }
        return clone;
    }
}

/**
 * Jalali Implmentation of NiDate
 */
export class NiJalaliDatetime extends NiDatetime {

    __jdate = { jy: null, jm: null, jd: null };

    constructor(date?: Date) {
        super(date);
        this.use(date);
    }

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

    constructor(date?: Date) {
        super(date);
    }

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

export const padNumber = (num: any, limit: number): string => {
    return '0'.repeat(limit - num.toString().length) + num;
};

export const formatDate = (calendar: NiDatetime, locale: NiDatetimeLocale, format: string): string => {
    // ---------- formats ----------
    const f = {
        mediumDate: () => `${f.WWW()} ${f.DD()} ${f.MMM()}, ${f.YYYY()}`,
        mediumTime: () => `${f.hh()}:${f.mm()} ${f.a()}`,
        shortDate: () => `${f.YY()}/${f.M()}/${f.D()}`,
        shortTime: () => `${f.h()}:${f.m()} ${f.a()}`,
        longDate: () => `${f.WWWW()} ${f.DD()} ${f.MMMM()}, ${f.YYYY()}`,
        longTime: () => `${f.hh()}:${f.mm()}:${f.ss()} ${f.A()}`,
        medium: () => `${f.mediumDate()}, ${f.mediumTime()}`,
        short: () => `${f.shortDate()} ${f.shortTime()}`,
        long: () => `${f.longDate()} ${f.longTime()}`,
        iso: () => `${f.YYYY()}-${f.MM()}-${f.DD()}${calendar.__date.toISOString().substring(10)}`,

        YYYY: () => padNumber(calendar.year, 4),
        MMMM: () => locale.monthsName[calendar.month - 1],
        YY: () => padNumber(calendar.year, 4).substring(2),
        MMM: () => locale.monthsNameShort[calendar.month - 1],
        MM: () => padNumber(calendar.month, 2),
        M: () => calendar.month,
        DD: () => padNumber(calendar.date, 2),
        D: () => calendar.date,
        WWWW: () => locale.daysName[calendar.weekDay],
        WWW: () => locale.daysNameShort[calendar.weekDay],
        WW: () => locale.daysNameMini[calendar.weekDay],
        HH: () => padNumber(calendar.hours, 2),
        hh: () => padNumber(calendar.hours12, 2),
        H: () => calendar.hours,
        h: () => calendar.hours12,
        mm: () => padNumber(calendar.minutes, 2),
        m: () => calendar.minutes,
        ss: () => padNumber(calendar.seconds, 2),
        s: () => calendar.seconds,
        A: () => locale.AMPM[calendar.hours > 12 ? 1 : 0],
        a: () => locale.ampm[calendar.hours > 12 ? 1 : 0],
        z: () => calendar.__date.toString().substring(25, 33),
    };

    // one format may generate a value that can be misinterpreted by another format
    // use placeholers to hide each format output until concatenated at the end
    const placeholders = {};
    let counter = 0;

    // --- IMPORTANT NOTE ---
    // f.keys should be checked in order
    // so the longer format strings be evaulated first
    // ----------------------

    // .sort((a, b) => b.length - a.length)
    Object.keys(f).forEach(key => {
        while (format.indexOf(key) >= 0) {
            const placeholder = `$[[${counter++}]]`; // generate a placeholder
            placeholders[placeholder] = f[key](); // format and memorize for placeholder
            format = format.replace(key, placeholder); // replace key with placeholder
        }
    });

    // replace placeholders with values
    Object.keys(placeholders).forEach(pholder =>
        format = format.replace(pholder, placeholders[pholder]));

    return format;
};

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
        daysNameShort: ['یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه', 'شنبه'],
        daysNameMini: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        monthsName: ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد', 'سنبله', 'میزان', 'عقرب', 'قوس', 'جدی', 'دلو', 'حوت'],
        monthsNameShort: ['حم', 'ثو', 'جو', 'سر', 'اس', 'سن', 'می', 'عق', 'قو', 'جد', 'دل', 'حو'],
        ampm: ['ق.ظ', 'ب.ظ'],
        AMPM: ['قبل از ظهر', 'بعد از ظهر'],
        today: 'امروز',
        clear: 'پاک'
    },
    ps_AF: {
        name: 'ps_AF',
        new: () => new NiJalaliDatetime(),
        week: '#',
        dir: 'rtl',
        firstday: 6,
        weekends: [5],
        daysName: ['یکشنبه', 'دوشنبه', 'سې شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبې'],
        daysNameShort: ['یک', 'دو', 'سې', 'چهار', 'پنج', 'جمعه', 'شنبې'],
        daysNameMini: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        monthsName: ['وری', 'غوایی', 'غبر گولی', 'چنگاش', 'زمری', 'وژی', 'تله', 'لرم', 'لیندی', 'مرغومی', 'سلواغه', 'کب'],
        monthsNameShort: ['وری', 'غوایی', 'غبر گولی', 'چنگاش', 'زمری', 'وژی', 'تله', 'لرم', 'لیندی', 'مرغومی', 'سلواغه', 'کب'],
        ampm: ['س', 'ښ'],
        AMPM: ['سهار', 'ماښام'],
        today: 'نن',
        clear: 'پاک'
    },
    fa_IR: {
        name: 'fa_IR',
        new: () => new NiJalaliDatetime(),
        week: '#',
        dir: 'rtl',
        firstday: 6,
        weekends: [5],
        daysName: ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
        daysNameShort: ['یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه', 'شنبه'],
        daysNameMini: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
        monthsName: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        monthsNameShort: ['فر', 'ار', 'خر', 'تی', 'مر', 'شه', 'مه', 'آب', 'آذ', 'دی', 'به', 'اس'],
        ampm: ['ق.ظ', 'ب.ظ'],
        AMPM: ['قبل از ظهر', 'بعد از ظهر'],
        today: 'امروز',
        clear: 'پاک'
    },
    ar_SA: {
        name: 'ar_SA',
        new: () => new NiIslamicDatetime(),
        week: '#',
        dir: 'rtl',
        firstday: 0,
        weekends: [5, 6],
        daysName: ['الأحد', 'الإثنين', 'الثُلاثاء', 'الأربعاء', 'الخميس', 'الجُمْعَة', 'السبت'],
        daysNameShort: ['أحد', 'إثنين', 'ثُلاثاء', 'أربعاء', 'خميس', 'جُمْعَة', 'سبت'],
        daysNameMini: ['ح', 'ث', 'ثُ', 'ع', 'خ', 'جُ', 'س'],
        monthsName: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى',
            'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدة', 'ذوالحجة'],
        monthsNameShort: ['محرم', 'صفر', 'ربيع ١', 'ربيع ٢', 'جمادى ١',
            'جمادى ٢', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
        ampm: ['ق.ظ', 'ب.ظ'],
        AMPM: ['قبل الظهر', 'بعد الظهر'],
        today: 'اليوم',
        clear: 'نظيف'
    },
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
        AMPM: ['AM', 'PM'],
        today: 'Today',
        clear: 'Clear'
    }
};

export const toTimezone = (date: Date, targetTimezoneUTCOffset?: number) => {
    date = new Date(date.getTime());
    if (targetTimezoneUTCOffset) {
        // from local to utc
        date.setTime(date.getTime() + (date.getTimezoneOffset() * 60_000));
        // from utc to target
        date.setTime(date.getTime() + (targetTimezoneUTCOffset * 60_000));
    }
    return date;
};
