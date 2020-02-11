import { NgModule } from '@angular/core';
import { NiClockComponent } from "./ni-clock/ni-clock.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [NiClockComponent],
  imports: [CommonModule],
  exports: [NiClockComponent]
})
export class NiClockModule { }
