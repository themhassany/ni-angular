# NiDatetimePipe
Angular Pipe for [NiDatetime](https://github.com/jone30rw/ni-angular/tree/master/projects/ni-datetime)

## Installation
    npm i ni-datetime-pipe

```typescript
import { NiDatetimePipeModule } from 'ni-datetime-pipe'; // <= import

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NiDatetimePipeModule, // <= register
  ],
  providers: [
    NiDatetimePipeService // <= add provider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Example
- Your component class:
```typescript
import { Locales } from 'ni-datetime';
import { NiDatetimePipeService } from 'ni-datetime-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  date = new Date();

  constructor(private pipeService: NiDatetimePipeService) {
    // specify default pipe locale
    // or change it when ever you want
    this.pipeService.locale = Locales.fa_AF;
  }
}
```

- Your component html template:
```html
{{ date | ni_date:"WWWW DD MMMM, YYYY HH:mm:ss A" }}
<!-- دوشنبه 30 جدی, 1398 16:43:21 بعد از ظهر -->
{{ date | ni_date:"WWWW DD MMMM, YYYY HH:mm:ss A":"en_US" }}
<!-- Monday 20 January, 2020 16:43:37 PM -->
{{ date | ni_date:"WWWW DD MMMM, YYYY HH:mm:ss A":YOUR_CUSTOM_NiDatetimeLocale_OBJECT }}
<!-- ... -->
```

**Check [NiDatetime](https://github.com/jone30rw/ni-angular/tree/master/projects/ni-datetime) for available formats.**