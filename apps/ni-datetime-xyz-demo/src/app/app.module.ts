import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { NiDatetimePickerModule } from 'ni-datetime-picker';
import { NiDatetimePipeModule } from 'ni-datetime-pipe';
import { NiClockModule } from "ni-clock";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NiDatetimePipeModule,
    NiDatetimePickerModule,
    NiClockModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
