import { Type } from '@angular/compiler';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumMap',
})
export class EnumPipe implements PipeTransform {
  transform(value: number, typeMap: any): unknown {
    return Object.values(typeMap)[value];
  }
}
