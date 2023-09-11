import {Injectable} from '@angular/core';
import {WeatherHttpService} from "./weather-http.service";
import {map, Observable} from "rxjs";
import {ICityInfo} from "../models/city-info.interface";
import {IWeather} from "../models/weather.interface";
import {addDays} from "date-fns";
import format from "date-fns/format";
import {hourly} from "../models/table-header-cell-names.const";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private weatherHttpService: WeatherHttpService) {
  }

  getCityList(cityName: string): Observable<ICityInfo[]> {
    return this.weatherHttpService.getCityList(cityName).pipe(
      map(list => list?.map(item => ({
        cityName: item.name,
        lat: item.lat,
        lon: item.lon
      })))
    );
  }

  getWeatherInfoFilterByHour(cityName: string, lat: number, lon: number): Observable<IWeather> {
    return this.weatherHttpService.getWeatherInfoFilterByHour(lat, lon).pipe(
      map(item => {
        const tomorrowTime = addDays(new Date(), 1);
        const tomorrow = format(tomorrowTime, 'yyyy-MM-dd');
        const tomorrowHours = hourly.map(time => tomorrow + ' ' + time);

        return {
          cityName: cityName,
          temp: item.hourly.filter(item => {
            const date = format(item.dt * 1000, 'yyyy-MM-dd HH:mm');
            return tomorrowHours.includes(date);
          }).map(item => ({
            dt: item.dt,
            degree: item.temp
          })),
        }
      }),
    );
  }

  getWeatherInfoFilterByDaily(cityName: string, lat: number, lon: number): Observable<IWeather> {
    return this.weatherHttpService.getWeatherInfoFilterByDaily(lat, lon).pipe(
      map(item => ({
        cityName: cityName,
        temp: item.daily.filter((item, index) => index !== 0).map(item => ({
          dt: item.dt,
          degree: item.temp.day
        })),
      }))
    );
  }
}
