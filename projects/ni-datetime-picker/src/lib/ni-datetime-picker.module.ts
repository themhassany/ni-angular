import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { NiDatetimePickerComponent } from './ni-datetime-picker.component';

@NgModule({
  declarations: [NiDatetimePickerComponent],
  imports: [CommonModule, FormsModule],
  exports: [NiDatetimePickerComponent]
})
export class NiDatetimePickerModule { }
