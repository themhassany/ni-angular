# ni-datetime-picker
Angular8 mont|date|time picker with Persian (Afghanistan, and Iran), and Gregorian calendar support.

# Installation
    npm i ni-datetime-picker

# Demo
Stackblitz Demo: https://angular-9g15ep.stackblitz.io

Stackblitz play ground: https://stackblitz.com/edit/angular-9g15ep

# Screenshots
<img src="../../screenshots/datetime-picker1.png" width="200" title="datetime-picker1.png">
<img src="../../screenshots/datetime-picker12.png" width="200" title="datetime-picker12.png">
<img src="../../screenshots/datetime-picker3.png" width="200" title="datetime-picker3.png">
<img src="../../screenshots/month-picker.png" width="200" title="month-picker.png">
<img src="../../screenshots/time-picker.png" width="200" title="time-picker.png">

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
        // attributes and their default values
        [(value)]="null"
        [defaultDate]="new Date()"

        [(locale)]="fa_AF" // or a NiDatetimeLocale object
        [enableLocaleSwitch]="false"

        inputFormat="YYYY-MM-DD HH:mm AP"
        placeholder=""
        titleFormat="MMMM YYYY"
        monthHeaderFormat="MMMM YYYY"

        [numberOfMonths]="1"
        [monthPicker]="false"
        [datePicker]="true"
        [timePicker]="false"
        [inline]="false"
        
        (selected)=""
        (showed)=""
        (hidded)=""
        (viewUpdated)=""
        (localeChanged)=""
        (focused)=""
        (blurred)="">
    </ni-datetime-picker>

### [(value)]
- a date object which read to changed by datepicker.

### [defaultDate]
- when 'value' is null, the datepicker will use this value to prepare the view.

### [(locale)]
- the locale to use for using month, and day names. availables are: fa_AF, fa_IR, en_US. provide a NiDatetimeLocale object if you want to customize.

### [enableLocaleSwitch]
- show/hide the locale switcher. note: your custom calendarLocale will be ignored during switching.

### inputFormat
- locale dependent date formatter for the datepicker input (selected date is formatted and set as the text to datepicker input). check the formatting for more information.

### placeholder
- datepicker input placeholder.

### titleFormat
- datepicker dialog title format. check the formatting for more information.

### [numberOfMonths]
- ranging from 1 to 12 (included) specifies the number of visible month in datepicker view

### monthHeaderFormat
- if numberOfMonths > 1, this specifies the each month header format. check the formatting for more information.

### [monthPicker]
- is a month picker

### [datePicker]
- is a date picker. it is overrided if monthPicker is true.

### [timePicker]
- is a time picker. it is overrided if monthPicker is true.

### [inline]
- is inline

### (selected)
- trigger when a select event is happened.

        interface SelectEvent {
            ndate: ViewDate;
            formatted: string;
            date: Date;
        }

### (showed)
- trigger when a show event is happened. null is passed as the value.

### (hidded)
- trigger when a hide event is happened. null is passed as the value.

### (viewUpdated)
- trigger when a view update event is happened.

        interface ViewUpdateEvent {
            viewMinDate: Date;
            viewMaxDate: Date;
        }

### (localeChanged)
- trigger when a locale change event is happened.

        interface LocaleChangeEvent {
            previous: 'fa_AF' | 'fa_IR' | 'en_US';
            locale: 'fa_AF' | 'fa_IR' | 'en_US';
        }

### (focused)
- trigger when a Focus event is happened. null is passed as the value.

### (blurred)
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