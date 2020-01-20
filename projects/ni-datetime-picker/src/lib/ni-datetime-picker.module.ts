import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NiDatetimeModule } from "ni-datetime";

import { NiDatetimePickerComponent } from './ni-datetime-picker.component';

@NgModule({
  declarations: [NiDatetimePickerComponent],
  imports: [CommonModule, NiDatetimeModule],
  exports: [NiDatetimePickerComponent]
})
export class NiDatetimePickerModule { }
