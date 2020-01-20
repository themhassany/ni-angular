import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NiDatetimePipeService } from "./ni-datetime-pipe.service";
import { NiDatetimeLocale, formatDate, Locales } from "ni-datetime";

@Pipe({ name: 'ni_date', pure: false })
export class NiDatetimePipe implements PipeTransform, OnDestroy {

  __cached = {
    locale: null,
    value: null,
    format: null,
    return: null
  };

  constructor(private service: NiDatetimePipeService) {
    this.service.onLocaleChange(this.localeChanged.bind(this));
  }

  ngOnDestroy() {
    this.service.offLocaleChange(this.localeChanged.bind(this));
  }

  get locale() {
    return this.service.locale;
  }

  localeChanged(locale: NiDatetimeLocale) {
  }

  transform(value: any, format: string = "medium", custom?: string | NiDatetimeLocale): any {
    let locale = null;

    // use the custom locale if provided
    if (!custom) {
      locale = this.locale;
    } else if ((typeof custom) === "string" && custom in Locales) {
      locale = Locales[custom as string];
    } else { // it should be NiDatetimeLocale
      locale = custom;
    }

    // is cached
    if (this.__cached.value === value
      && this.__cached.format === format
      && this.__cached.locale === locale.name) {
      return this.__cached.return;
    }

    // cache it
    this.__cached.locale = locale.name;
    this.__cached.value = value;
    this.__cached.format = format;

    // convert to date
    if ((typeof value) === "string") {
      value = new Date(value);
    }

    // format and cache
    this.__cached.return = formatDate(locale.new().use(value), locale, format);
    return this.__cached.return;
  }
}
