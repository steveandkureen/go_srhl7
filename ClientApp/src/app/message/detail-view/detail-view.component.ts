import { Component, Input, SimpleChanges } from '@angular/core'
import { HL7Segment } from '../message-models/HL7Segment'
import { HL7Field } from '../message-models/HL7Field'
import { IHL7Field } from '../message-models/HL7Component'
import { SegmentDetailService } from '../segment-detail.service'
import { Observable, of } from 'rxjs'
import { ISegmentDetails } from '../message-models/HL7SegementDetails'

@Component({
   selector: 'app-detail-view',
   templateUrl: './detail-view.component.html',
   styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent {
   @Input('segment') segment!: HL7Segment | null

   segmentDetail?: ISegmentDetails | null = null
   flattenedFields: HL7FieldModel[] = []

   constructor(private segmentDetailService: SegmentDetailService) {}

   ngOnInit(): void {}

   ngOnChanges(changes: SimpleChanges) {
      for (let propName in changes) {
         if (propName === 'segment') {
            if (this.segment) {
               this.segmentDetailService
                  .getSegmentDetails([this.segment?.Header])
                  .subscribe((segment) => {
                     if (segment) {
                        this.segmentDetail = segment
                     }
                  })
               let newFields: HL7FieldModel[] = []
               this.flattenFields(this.segment.Fields, newFields)
               this.flattenedFields = [...newFields]
            }
         }
      }
   }

   flattenFields(
      fields: IHL7Field[],
      result: HL7FieldModel[],
      depth = 0,
      parentIndex = ''
   ): HL7FieldModel[] {
      if (!this.segment) return []

      if (!fields) {
         fields = []
      }

      fields
         .sort((f) => f.Index)
         .forEach((field) => {
            result.push(
               new HL7FieldModel(
                  field,
                  depth,
                  `${parentIndex}${parentIndex == '' ? '' : '.'}${field.Index}`
               )
            )
            if (field.Components.length > 0) {
               this.flattenFields(
                  field.Components,
                  result,
                  depth + 1,
                  `${parentIndex}${parentIndex == '' ? '' : '.'}${field.Index}`
               )
            }
         })
      return result
   }

   getSegmentDetail(header: string, index: string): string {
      if (this.segmentDetail?.SegmentLabels.hasOwnProperty(index)) {
         let label = this.segmentDetail?.SegmentLabels[index]
         if (label) {
            return label
         }
      }
      return ''
   }
}

export class HL7FieldModel {
   constructor(public Field: IHL7Field, public depth: number, public displayIndex: string) {}
}
