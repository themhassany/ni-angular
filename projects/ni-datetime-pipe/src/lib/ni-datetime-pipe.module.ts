import { NgModule } from '@angular/core';
import { NiDatetimePipeService } from './ni-datetime-pipe.service';
import { NiDatetimePipe as NiDatetimePipe } from './ni-datetime.pipe';

@NgModule({
  declarations: [NiDatetimePipe],
  imports: [],
  exports: [NiDatetimePipe],
  providers: [NiDatetimePipeService]
})
export class NiDatetimePipeModule { }
