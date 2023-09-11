import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'degree'
})
export class DegreePipe implements PipeTransform {
  transform(value: number): string {
    const T0 = 273.15;
    return `${(value - T0).toFixed()}°`
  };
}
