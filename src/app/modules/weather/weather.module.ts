import {NgModule} from '@angular/core';
import {WeatherComponent} from './weather.component';
import {WeatherRoutingModule} from "./weather-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {WeatherTableComponent} from './components/weather-table/weather-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatOptionModule} from "@angular/material/core";
import {DegreePipe} from './pipes/degree.pipe';

@NgModule({
  declarations: [
    WeatherComponent,
    WeatherTableComponent,
    DegreePipe,
  ],
  imports: [
    WeatherRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    MatButtonToggleModule,
    MatTableModule,
    MatOptionModule
  ],
})
export class WeatherModule {
}
