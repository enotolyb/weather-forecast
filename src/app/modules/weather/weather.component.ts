import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {IWeather} from "./models/weather.interface";
import {ICityInfo} from "./models/city-info.interface";
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap, tap
} from "rxjs";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {EMode} from "./models/mode.enum";
import {WeatherService} from "./services/weather.service";

@Component({
  selector: 'weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent implements OnInit {
  isLoadingCities$ = new BehaviorSubject(false);
  weatherList$!: Observable<IWeather[]>;
  selectedCities$ = new BehaviorSubject<ICityInfo[]>([]);
  searchCities$!: Observable<ICityInfo[]> | undefined;

  form = this.fb.group({
    city: this.fb.control<ICityInfo | null>(null),
    filter: this.fb.nonNullable.control<EMode>(EMode.daily)
  });
  EMode = EMode;

  constructor(private fb: FormBuilder,
              private weatherService: WeatherService
  ) {
    this.form.get('city')?.valueChanges.pipe(
      filter(city => typeof city === "object" && !!city),
      takeUntilDestroyed(),
    ).subscribe(city => {
      this.selectedCities$.next([...this.selectedCities$.value, city!])
      this.form.controls.city.patchValue(null);
    })
  }

  ngOnInit() {
    this.searchCities$ = this.form.get('city')?.valueChanges.pipe(
      tap(() => this.isLoadingCities$.next(true)),
      debounceTime(300),
      switchMap((cityName) => typeof cityName === "string" ? this.weatherService.getCityList(cityName) : of([])),
      tap(() => this.isLoadingCities$.next(false)),
    )

    const dailyWeather$ = this.selectedCities$.pipe(
      switchMap(cities => combineLatest(
        cities.map(({ cityName, lat, lon }) => this.weatherService.getWeatherInfoFilterByDaily(cityName, lat, lon)))),
      shareReplay({refCount: false, bufferSize: 1})
    )

    const hourlyWeather$ = this.selectedCities$.pipe(
      switchMap(cities => combineLatest(
        cities.map(({ cityName, lat, lon }) => this.weatherService.getWeatherInfoFilterByHour(cityName, lat, lon)))),
      shareReplay({refCount: false, bufferSize: 1})
    )

    this.weatherList$ = this.form.controls.filter.valueChanges.pipe(
      startWith(this.form.controls.filter.value),
      switchMap(mode => mode === EMode.daily ? dailyWeather$ : hourlyWeather$)
    )
  }
}
