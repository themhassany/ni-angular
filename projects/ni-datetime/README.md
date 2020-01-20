# NiDatetime
Converter class for Jalali/Farsi/Persian to Gregorian and wise versa.

**Note: Months are started from 1.**

## Installation
    npm i ni-datetime

## API
```typescript 
// wrapper for jalali date
export class NiJalaliDatetime    extends NiDatetime { }
// wrapper for gregorian date
export class NiGregorianDatetime extends NiDatetime { }

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
```

## Example

```typescript
const jalali = new NiJalaliDatetime(new Date());

console.log(jalali.__date); // internal date object
console.log(jalali.ymd);    // eg: {year:1390, month:1, date:12}
jalali.ymd = {year: 1360, month: 9, date: 12}

console.log(jalali.__date); // internal date object is changed

console.log(jalali.use(new Date()).ymd); // set to now and get ymd 
// -----------------------------------------

const gregorian = new NiGregorianDatetime(new Date());

console.log(gregorian.__date); // internal date object
console.log(gregorian.ymd);    // eg: {year:1980, month:1, date:12}
gregorian.ymd = {year: 2020, month: 9, date: 12}

console.log(gregorian.__date); // internal date object is changed

console.log(gregorian.use(new Date()).ymd); // set to now and get ymd
```

## Credits:
- Uses [Jalali JavaScript](https://github.com/jalaali/jalaali-js) for Jalali conversion.