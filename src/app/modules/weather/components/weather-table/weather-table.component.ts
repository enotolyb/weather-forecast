import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IWeather} from "../../models/weather.interface";
import {EMode} from "../../models/mode.enum";
import {daily, hourly} from "../../models/table-header-cell-names.const";

@Component({
  selector: 'weather-table',
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherTableComponent implements OnChanges {
  @Input() weatherList!: IWeather[] | null;
  @Input() mode!: EMode;

  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mode']) {
      this.displayedColumns = ['name', ...(this.mode === EMode.daily ? daily : hourly)]
    }
  }
}
