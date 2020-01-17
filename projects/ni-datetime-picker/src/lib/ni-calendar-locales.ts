import { NiJalaliDate } from './ni-jalali-date';
import { NiGregorianDate } from './ni-gregorian-date';
import { NiDate } from './ni-date-wrapper';

export interface NCalendarLocale {
    newInstance: () => NiDate;
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

export const AVAIL_LOCALES = {
    fa_AF: {
        newInstance: () => new NiJalaliDate(),
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
    } as NCalendarLocale,
    fa_IR: {
        newInstance: () => new NiJalaliDate(),
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
    } as NCalendarLocale,
    en_US: {
        newInstance: () => new NiGregorianDate(),
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
    } as NCalendarLocale
};
