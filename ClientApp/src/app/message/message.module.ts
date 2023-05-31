import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MessageViewComponent } from './message-view/message-view.component'
import { MatDialogModule } from '@angular/material/dialog'
import { MatTableModule } from '@angular/material/table'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { MatButtonModule } from '@angular/material/button'
import { DetailViewComponent } from './detail-view/detail-view.component'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
   declarations: [MessageViewComponent, DetailViewComponent],
   imports: [
      CommonModule,
      MatDialogModule,
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      NgxDatatableModule,
   ],
})
export class MessageModule {}
