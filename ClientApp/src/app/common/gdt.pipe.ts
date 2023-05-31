import { Pipe, PipeTransform } from '@angular/core'
import * as dayjs from 'dayjs'
import 'dayjs/locale/es'

@Pipe({
   name: 'gdt',
})
export class GdtPipe implements PipeTransform {
   transform(value: string, ...args: unknown[]): string {
      if (value) {
         let d = dayjs(value)
         return d.format('YYYY MMM DD\nhh:mm:ss.sss a')
      }
      return ''
   }
}
