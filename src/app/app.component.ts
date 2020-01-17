import { Component } from '@angular/core';
import { NiJalaliDatetime } from 'ni-datetime-picker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  // date: Date;
  date = new Date();
  defauld = new Date('2010-10-10');
  loci = 'en_US';
  inputFormatted: string;
  open = true;
  locale = {
    newInstance: () => new NiJalaliDatetime(),
    wk: 'js',
    dir: 'ltr',
    firstday: 5,
    weekends: [0, 3, 5],
    daysName: ['Sunxxx', 'Monxxx', 'Tuesxxx', 'Wedsxxx', 'Thursxxx', 'Frixxx', 'Saturxxx'],
    daysShortName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMiniName: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthsName: ['January', 'February', 'March', 'April', 'May', 'June',
      'd', 'August', 'September', 'October', 'November', 'December'],
    monthsShortName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ampm: ['am', 'pm'],
    AMPM: ['AM', 'PM']
  };

  event(event) {
    console.log(event);
  }
}
