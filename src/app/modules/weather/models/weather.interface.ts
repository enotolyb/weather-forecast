export interface IWeather {
  cityName: string;
  temp: {
    dt: number;
    degree: number;
  }[];
}
