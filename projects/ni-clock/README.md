# NiClock
Angular 8 Clock UI

## Installation
    npm i ni-clock

```typescript
import { NiClockModule } from 'ni-clock'; // <= import

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NiClockModule, // <= register
  ]
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Example
- Your component class:
```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

    date = new Date();
    // ...
}
```

- Your component html template:
```html
<ni-clock [time]="value" [auto]="false"></ni-clock>
<!-- ... -->
```

## API
- **[time]**: specifies the date object that is used to show the clock.
- **[auto]**: if true, the clock start ticking. true by default.