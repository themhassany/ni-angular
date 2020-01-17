# ni-datetime-picker
Angular8 mont|date|time picker with Persian (Afghanistan, and Iran), and Gregorian calendar support.

# Installation
    npm i ni-datetime-picker

# Import the NiDatetimePickerModule

    // import the module
    import { NiDatetimePickerModule } from 'ni-datetime-picker';

    ...

    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            // register it
            NiDatetimePickerModule,
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
    export class AppModule { }

# In a Glance

Following example shows all the options avaiable in the component: 

    <ni-datetime-picker
        // attribute="defaultValue"
        [(model)]="null"
        [viewDefaultDate]="new Date()"
        
        [(openDialog)]="false"
        [closeOnSelect]="false"

        [(locale)]="fa_AF"
        [calendarLocale]="fa_AF_NiDatetimeLocaleObject"
        [localeSwitch]="false"
        
        inputFormat="YYYY-MM-DD HH:mm AP"
        placeholder=""
        titleFormat="MMMM YYYY"
        monthHeaderFormat="MMMM YYYY"

        [visibleMonths]="1"
        [monthPicker]="false"
        [datePicker]="true"
        [timePicker]="false"
        [inline]="false"
        
        (onChange)=""
        (onSelect)=""
        (onShow)=""
        (onHide)=""
        (onViewUpdate)=""
        (onLocaleChange)=""
        (onFocus)=""
        (onBlur)="">
    </ni-datetime-picker>

### [(model)]
- a date object which read to changed by datepicker.

### [viewDefaultDate]
- when 'model' is null, the datepicker will use this value to prepare the view.

### [(openDialog)]
- bind a boolean value to datepicker dialog open attribute.

### [closeOnSelect]
- close the datepicker when a date is selected.

### [(locale)]
- the locale to use for using month, and day names. availables are: fa_AF, fa_IR, en_US.

### [calendarLocale]
- provide your custom locale texts by passing a NiDatetimeLocale object.

### [localeSwitch]
- show/hide the locale switcher. note: your custom calendarLocale will be ignored during switching.

### inputFormat
- locale dependent date formatter for the datepicker input (selected date is formatted and set as the text to datepicker input). check the formatting for more information.

### placeholder
- datepicker input placeholder.

### titleFormat
- datepicker dialog title format. check the formatting for more information.

### [visibleMonths]
- ranging from 1 to 12 (included) specifies the number of visible month in datepicker view

### monthHeaderFormat
- if visibleMonths > 1, this specifies the each month header format. check the formatting for more information.

### [monthPicker]
- is a month picker

### [datePicker]
- is a date picker. it is overrided if monthPicker is true.

### [timePicker]
- is a time picker. it is overrided if monthPicker is true.

### [inline]
- is inline

### (onChange)
- trigger when a change event is happened.

        interface ChangeEvent {
            formatted: string;
            date: Date;
        }

### (onSelect)
- trigger when a select event is happened.

        interface SelectEvent {
            ndate: ViewDate;
            date: Date;
        }

### (onShow)
- trigger when a show event is happened. null is passed as the value.

### (onHide)
- trigger when a hide event is happened. null is passed as the value.

### (onViewUpdate)
- trigger when a view update event is happened.

        interface ViewUpdateEvent {
            viewMinDate: Date;
            viewMaxDate: Date;
        }

### (onLocaleChange)
- trigger when a locale change event is happened.

        interface LocaleChangeEvent {
            previous: 'fa_AF' | 'fa_IR' | 'en_US';
            locale: 'fa_AF' | 'fa_IR' | 'en_US';
        }

### (onFocus)
- trigger when a Focus event is happened. null is passed as the value.

### (onBlur)
- trigger when a Blur event is happened. null is passed as the value.


# Formats

- 'YYYY', 4 digit year
- 'YY', 2 digit year
- 'MMMM', long name of month 
- 'MMM', short name of month 
- 'MM', 2 digit month number
- 'M', month number
- 'DD', 2 digit date number
- 'D', date number
- 'WWWW', long name of week's day
- 'WWW', short name of week's day
- 'WW', mini name of week's day
- 'HH', 2 digit hour (24h format)
- 'hh', 2 digit hour (12h format)
- 'H', hour (24h format)
- 'h', hour (12h format)
- 'mm', 2 digit minute
- 'm', minute
- 'ss', 2 digit second
- 's', second
- 'A', upper case AM/PM
- 'a', lower case am/pm
- 'z', time zone (eg: GMT-0500)
- 'iso', iso format (eg: 2020-01-17T08:57:58.144Z)