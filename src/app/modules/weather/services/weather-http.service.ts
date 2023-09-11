import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CityQuery} from "./models/city.query";
import {WeatherQuery} from "./models/weather.query";

@Injectable({
  providedIn: 'root'
})
export class WeatherHttpService {
  apiKey = '010721642521f31b0fbc8c3831d45951';

  constructor(private http: HttpClient) {
  }

  getCityList(cityName: string): Observable<CityQuery[]> {
    return this.http.get<CityQuery[]>(`${environment.urls.openWeather}/geo/1.0/direct`, {
      params: {
        q: cityName,
        limit: 5,
        appid: this.apiKey
      }
    });
  }

  getWeatherInfoFilterByHour(lat: number, lon: number): Observable<WeatherQuery> {
    return this.http.get<WeatherQuery>(`${environment.urls.openWeather}/data/2.5/onecall`, {
      params: {
        lat: lat,
        lon: lon,
        exclude: 'current,minutely,daily,alerts',
        appid: this.apiKey
      }
    });
  }

  getWeatherInfoFilterByDaily(lat: number, lon: number): Observable<WeatherQuery> {
    return this.http.get<WeatherQuery>(`${environment.urls.openWeather}/data/2.5/onecall`, {
      params: {
        lat: lat,
        lon: lon,
        exclude: 'current,minutely,hourly,alerts',
        appid: this.apiKey
      }
    });
  }
}
