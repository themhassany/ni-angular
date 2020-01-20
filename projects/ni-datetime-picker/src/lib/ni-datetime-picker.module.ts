import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NiDatetimePickerComponent } from './ni-datetime-picker.component';

@NgModule({
  declarations: [NiDatetimePickerComponent],
  imports: [CommonModule],
  exports: [NiDatetimePickerComponent]
})
export class NiDatetimePickerModule { }
