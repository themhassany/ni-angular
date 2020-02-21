// retrieved from https://www.fourmilab.ch/documents/calendar/ by John Walker.

/*  MOD  --  Modulus function which works for non-integers.  */

function mod(a: number, b: number) {
    return a - (b * Math.floor(a / b));
}

//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?

export function leap_gregorian(y: number) {
    return ((y % 4) === 0) && (!(((y % 100) === 0) && ((y % 400) !== 0)));
}

const GREGORIAN_EPOCH = 1721425.5;

export function gregorian_to_jd(y: number, m: number, d: number) {
    return (
        GREGORIAN_EPOCH -
        1 +
        365 * (y - 1) +
        Math.floor((y - 1) / 4) +
        -Math.floor((y - 1) / 100) +
        Math.floor((y - 1) / 400) +
        Math.floor((367 * m - 362) / 12 + (m <= 2 ? 0 : leap_gregorian(y) ? -1 : -2) + d)
    );
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

export function jd_to_gregorian(jd: number) {
    let wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, dyindex, year, yearday, leapadj, month, day;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent === 4) || (yindex === 4))) {
        year++;
    }
    yearday = wjd - gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0 : (leap_gregorian(year) ? 1 : 2));
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - gregorian_to_jd(year, month, 1)) + 1;

    return new Array(year, month, day);
}

//  LEAP_ISLAMIC  --  Is a given year a leap year in the Islamic calendar ?

function leap_islamic(year: number) {
    return (((year * 11) + 14) % 30) < 11;
}

//  ISLAMIC_TO_JD  --  Determine Julian day from Islamic date
const ISLAMIC_EPOCH = 1948439.5;

export function islamic_to_jd(y: number, m: number, d: number) {
    return (
        d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 + Math.floor((3 + 11 * y) / 30) + ISLAMIC_EPOCH - 1
    );
}

//  JD_TO_ISLAMIC  --  Calculate Islamic date from Julian day

export function jd_to_islamic(jd: number) {
    jd = Math.floor(jd) + 0.5;
    const year = Math.floor((30 * (jd - ISLAMIC_EPOCH) + 10646) / 10631);
    const month = Math.min(12, Math.ceil((jd - (29 + islamic_to_jd(year, 1, 1))) / 29.5) + 1);
    const day = jd - islamic_to_jd(year, month, 1) + 1;
    return new Array(year, month, day);
}

export function days_in_month(y: number, m: number) {
    return [null, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, leap_islamic(y) ? 30 : 29][m];
}

export function greg_to_islamic(d: Date) {
    const is = jd_to_islamic(
        gregorian_to_jd(d.getFullYear(), d.getMonth() + 1, d.getDate())
        + Math.floor(d.getSeconds() + 60 * (d.getMinutes() + 60 * d.getHours()) + 0.5)
        / 86400.0
    );
    return { iy: is[0], im: is[1], id: is[2] };
}

export function islamic_to_greg(d: { iy: number, im: number, id: number }) {
    const greg = jd_to_gregorian(islamic_to_jd(d.iy, d.im, d.id));
    return { gy: greg[0], gm: greg[1], gd: greg[2] };
}
