export class ViewMonth {
  title: string;
  year: number;
  month: number;
  date: number;
  weeknums: number[];
  weekdays: { title: string, wk: boolean }[];
  dates: ViewDate[];
}

export class ViewDate {
  year: number;
  month: number;
  date: number;
  today?: boolean;
  weekend?: boolean;
  prev?: boolean;
  next?: boolean;
  selected?: boolean;
}

export interface ChangeEvent {
  formatted: string;
  date: Date;
}

export interface ViewUpdateEvent {
  viewMinDate: Date;
  viewMaxDate: Date;
}

export interface SelectEvent {
  ndate: ViewDate;
  date: Date;
}

export interface LocaleChangeEvent {
  previous: 'fa_AF' | 'fa_IR' | 'en_US';
  locale: 'fa_AF' | 'fa_IR' | 'en_US';
}
