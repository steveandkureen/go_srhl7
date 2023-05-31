import { Component, Inject, Input } from '@angular/core'
import { HL7Message } from '../message-models/HL7Message'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable'
import { HL7Segment } from '../message-models/HL7Segment'
import { SegmentDetailService } from '../segment-detail.service'

@Component({
   selector: 'app-message-view',
   templateUrl: './message-view.component.html',
   styleUrls: ['./message-view.component.scss'],
})
export class MessageViewComponent {
   message: HL7Message = new HL7Message()

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: { message: string },
      private segmentDetailService: SegmentDetailService
   ) {}
   showDetail = false
   testData = { data: ['bla', 'bla', 'bloo', 'blee'] }
   columnMode = ColumnMode.flex
   selectionType = SelectionType.single
   ngOnInit(): void {
      this.message = HL7Message.ParseMessage(this.data.message)
      this.message.Segments.forEach((segment) => {
         this.segmentDetailService.getSegmentDetails([segment.Header]).subscribe()
      })
   }

   selectedSegment: HL7Segment | null = null
   ShowDetail(segment: HL7Segment) {
      if (this.selectedSegment == segment) {
         this.showDetail = false
         this.selectedSegment = null
      } else {
         this.showDetail = true
         this.selectedSegment = segment
      }
   }
}
