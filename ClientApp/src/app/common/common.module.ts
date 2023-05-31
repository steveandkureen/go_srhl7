import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnumPipe } from './enum.pipe'
import { GdtPipe } from './gdt.pipe'

@NgModule({
   declarations: [EnumPipe, GdtPipe],
   imports: [CommonModule],
   exports: [EnumPipe, GdtPipe],
})
export class SRHL7CommonModule {}
