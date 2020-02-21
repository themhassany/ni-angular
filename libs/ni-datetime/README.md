# NiDatetime
Converter class for Jalali/Farsi/Persian to Gregorian and vise versa.

**Note: Months are started from 1.**

## Installation
    npm i ni-datetime

## Example
```typescript
const jalali = new NiJalaliDatetime(new Date());

console.log(jalali.__date); // internal date object
console.log(jalali.ymd);    // eg: {year:1390, month:1, date:12}
jalali.ymd = {year: 1360, month: 9, date: 12}

console.log(jalali.__date); // internal date object is changed

console.log(jalali.use(new Date()).ymd); // set to now and get ymd 

console.log(formatDate(jalali, Locales.fa_AF, "WWWW DD MMMM YYYY")); // eg: شنبه 9 قوس 1390

// -----------------------------------------

const gregorian = new NiGregorianDatetime(new Date());

console.log(gregorian.__date); // internal date object
console.log(gregorian.ymd);    // eg: {year:1980, month:1, date:12}
gregorian.ymd = {year: 2020, month: 9, date: 12}

console.log(gregorian.__date); // internal date object is changed

console.log(gregorian.use(new Date()).ymd); // set to now and get ymd

console.log(formatDate(gregorian, Locales.en_US, "WWWW DD MMMM YYYY")); // eg: Monday 20 January 2020
```

## API
```typescript 
// wrapper for jalali date
export class NiJalaliDatetime    extends NiDatetime { }
// wrapper for islamic date
export class NiIslamicDatetime   extends NiDatetime { }
// wrapper for gregorian date
export class NiGregorianDatetime extends NiDatetime { }

// use to format a NiDatetime object
export const formatDate = (calendar: NiDatetime, 
                           locale: NiDatetimeLocale, 
                           format: string): string => { }

// list of available locales
export const Locales = {
    fa_AF: NiJalaliDatetime,
    fa_IR: NiJalaliDatetime,
    ar_SA: NiIslamicDatetime,
    en_US: NiGregorianDatetime
};


// base case
export class NiDatetime {

    __date: Date;

    constructor(date?: Date)                    { }

    use(date: Date)              : NiDatetime   { }

    get year()                   : number;
    get month()                  : number;
    get date()                   : number;
    get daysInMonth()            : number;
    get weeksFirstday()          : number;
    get weekDay()                : number;

    set ymd(ymd: Ymd)                           { }
    get ymd()                    : Ymd          { }

    get hours12()                : number       { }
    get hours()                  : number       { }
    set hours(hours: number)                    { }
    get minutes()                : number       { }
    set minutes(minutes: number)                { }
    get seconds()                : number       { }
    set seconds(seconds: number)                { }

    get am()                     : boolean      { }
    set am(toggle: boolean)                     { }

    get pm()                     : boolean      { }
    set pm(toggle: boolean)                     { }

    clone()                      : NiDatetime;
}

export class Ymd {
    year    : number;
    month   : number;
    date    : number;
}

export class Hms {
    hours   : number;
    minutes : number;
    seconds : number;
    isPM    : boolean;
}

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
        AMPM: ['قبل از ظهر', 'بعد از ظهر'],
        today: 'امروز',
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
        daysNameShort: ['یک', 'دو', 'سه ', 'چهار', 'پنج', 'جمعه', 'شنبه'],
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

// use to convert Date(and time) to another timezone
// Note: this change time property of date, so if you call 
// timezone related functions on the returning date
// it will still show your local timezone.
// eg: Fri Feb 21 2020 18:59:51 GMT-0500 (GMT-05:00)
// this part can't be changed =>^^^^^^^^^^^^^^^^^^^^
// but the date and time part is changed.
export const toTimezone = (date: Date, 
                           targetTimezoneUTCOffset?: number): Date => {}
```

## Available Formats
- `'YYYY', 4 digit year`
- `'YY', 2 digit year`
- `'MMMM', long name of month `
- `'MMM', short name of month `
- `'MM', 2 digit month number`
- `'M', month number`
- `'DD', 2 digit date number`
- `'D', date number`
- `'WWWW', long name of week's day`
- `'WWW', short name of week's day`
- `'WW', mini name of week's day`
- `'HH', 2 digit hour (24h format)`
- `'hh', 2 digit hour (12h format)`
- `'H', hour (24h format)`
- `'h', hour (12h format)`
- `'mm', 2 digit minute`
- `'m', minute`
- `'ss', 2 digit second`
- `'s', second`
- `'A', upper case AM/PM`
- `'a', lower case am/pm`
- `'z', time zone (eg: GMT-0500)`
- `'iso', iso format (eg: 2020-01-17T08:57:58.144Z)`
- `'mediumDate': 'WWW DD MMM, YYYY'`
- `'mediumTime': 'hh:mm a'`
- `'shortDate': 'YY/M/D'`
- `'shortTime': 'h:m a'`
- `'longDate': 'WWWW DD MMMM YYYY'`
- `'longTime': 'hh:mm:ss A'`
- `'medium': 'mediumDate mediumTime'`
- `'short': 'shortDate shortTime'`
- `'long': 'longDate longTime'`

## Credits:
- Uses [Jalali JavaScript](https://github.com/jalaali/jalaali-js) for Jalali conversion.
- Uses [John Walker](https://www.fourmilab.ch/documents/calendar/) code for Islamic conversion.