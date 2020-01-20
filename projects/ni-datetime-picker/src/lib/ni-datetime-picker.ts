export class ViewMonth {
  value: Date;
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
  disabled?: boolean;
}

export interface ViewUpdateEvent {
  viewMinDate: Date;
  viewMaxDate: Date;
}

export interface ValueChange {
  date?: Date;
  viewDate?: ViewDate;
  viewDateFormatted?: string;
}

export interface LocaleChangeEvent {
  previous: string;
  locale: string;
}