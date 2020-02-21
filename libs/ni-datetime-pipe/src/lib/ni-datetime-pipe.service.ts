import { Injectable } from '@angular/core';
import { NiDatetimeLocale } from "ni-datetime";

@Injectable({
  providedIn: 'root'
})
export class NiDatetimePipeService {

  __locale: NiDatetimeLocale;
  __callbacks: ((locale: NiDatetimeLocale) => void)[] = [];

  constructor() { }

  set locale(locale: NiDatetimeLocale) {
    this.__locale = locale;
  }

  get locale(): NiDatetimeLocale {
    return this.__locale;
  }

  onLocaleChange(change: (locale: NiDatetimeLocale) => void) {
    this.__callbacks.push(change);
  }

  offLocaleChange(change: (locale: NiDatetimeLocale) => void) {
    const i = this.__callbacks.indexOf(change);
    if (i) { this.__callbacks.splice(i, 0); }
  }

  __localeChanged() {
    this.__callbacks.forEach(callback => callback(this.__locale));
  }
}
