import { Component, HostListener, Input } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Observable } from 'rxjs/internal/Observable'
import { IMessageModel, MessageStatus, MessageStatusMap } from 'src/app/model/message-model'
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable'
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MessageViewComponent } from 'src/app/message/message-view/message-view.component'
import { EnumPipe } from 'src/app/common/enum.pipe'

@Component({
   selector: 'app-grid-view',
   templateUrl: './grid-view.component.html',
   styleUrls: ['./grid-view.component.scss'],
})
export class GridViewComponent {
   @Input('messages')
   messages: BehaviorSubject<IMessageModel[]> = new BehaviorSubject<IMessageModel[]>([])
   rows: IMessageModel[] = []
   statusTypeMap = MessageStatusMap
   constructor(public dialog: MatDialog) {}
   // columns = [{ name: 'Date Time', prop: "dateTime", maxWidth: 100 },
   //             { name: 'Message', prop: "message", minWidth: 150, canAutoResize: true },
   //             { name: 'Response', prop: "response", minWidth: 150, canAutoResize: true },
   //             { name: 'Status', prop: "messageStatus", maxWidth: 100 }]

   columnMode = ColumnMode.flex
   selectionType = SelectionType.single
   windowHeight: number = 0
   windowWidth: number = 0

   ngOnInit(): void {
      this.messages.subscribe((m) => {
         this.rows = [...m]
      })
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
   }

   openMessageDetail(message: string) {
      const dialogRef = this.dialog.open(MessageViewComponent, {
         data: { message: message },
         width: this.windowWidth - 50 + 'px',
      })
   }

   canClearMessageList() {
      return this.messages.getValue().length <= 0
   }

   clearMessageList() {
      this.messages.next([])
   }

   getMessageCount() {
      return this.messages.getValue().length
   }
}
