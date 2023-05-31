import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConnectionComponent } from './connection/connection.component';
import { SendViewComponent } from './send-view/send-view.component';
import { ReceiveViewComponent } from './receive-view/receive-view.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { GridViewComponent } from './grid-view/grid-view.component';
import { SendViewHeaderComponent } from './send-view-header/send-view-header.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddMessageComponent } from './add-message/add-message.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReceiveViewHeaderComponent } from './receive-view-header/receive-view-header.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MessageModule } from '../message/message.module';
import { SRHL7CommonModule } from '../common/common.module';
import { MatMenuModule } from '@angular/material/menu';
import { AddFileComponent } from './add-file/add-file.component';
import { ProgressComponent } from './progress/progress.component';
import { DndDirective } from './dnd.directive';
import { MatListModule } from '@angular/material/list';
import { TemplateModule } from '../template/template.module';

@NgModule({
  declarations: [
    ConnectionComponent,
    SendViewComponent,
    ReceiveViewComponent,
    GridViewComponent,
    SendViewHeaderComponent,
    AddMessageComponent,
    ReceiveViewHeaderComponent,
    AddFileComponent,
    ProgressComponent,
    DndDirective,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    SRHL7CommonModule,
    MatDialogModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    MessageModule,
    TemplateModule,
  ],
  exports: [SendViewComponent, ReceiveViewComponent],
})
export class ConnectionModule {}
