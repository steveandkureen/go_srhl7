import { Component, HostListener, Input, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, of, startWith } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ClientModel } from 'src/app/client/model/client-model';
import { ConnectionService } from '../connection.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddMessageComponent } from '../add-message/add-message.component';
import { IMessageModel, MessageStatus } from 'src/app/model/message-model';
import { v4 as uuidv4 } from 'uuid';
import { AddFileComponent } from '../add-file/add-file.component';
import { FileLoadService } from '../file-load.service';
import { TemplateLibraryComponent } from 'src/app/template/template-library/template-library.component';
import { TemplateAddComponent } from 'src/app/template/template-add/template-add.component';
import { TemplateService } from 'src/app/template/template.service';
import { TemplateModel, generateMessages } from 'src/app/model/template-model';
import { EditTemplateComponent } from 'src/app/template/edit-template/edit-template.component';

@Component({
  selector: 'app-send-view-header',
  templateUrl: './send-view-header.component.html',
  styleUrls: ['./send-view-header.component.scss'],
})
export class SendViewHeaderComponent {
  private _clientData: ClientModel | null = null;
  @Input('client-data') set clientData(value: ClientModel | null) {
    this._clientData = value;
    if (
      this.clientData &&
      this.clientData.ipAddresses &&
      this.clientData.ipAddresses.length
    ) {
      this.ipAddress.setValue(this.clientData?.ipAddresses[0]);
    }
  }
  get clientData(): ClientModel | null {
    return this._clientData;
  }

  private session_ClientId = uuidv4();
  ipAddresses: string[] = [];
  filteredOptions: Observable<string[]> | undefined;
  @Input('messages')
  messages!: BehaviorSubject<IMessageModel[]>;
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.connectionService.stopMessageResultsSSE(
      this.connectionId,
      this.session_ClientId
    );
  }
  ipAddress = new FormControl('');
  port = new FormControl('');
  connectionId: string = '';
  connected = false;

  constructor(
    public dialog: MatDialog,
    private _ngZone: NgZone,
    private connectionService: ConnectionService,
    private fileService: FileLoadService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.ipAddress.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (!this.clientData || !this.clientData.ipAddresses) return [];

    return this.clientData.ipAddresses;
  }

  connectButtonChagned(e: any) {
    if (e.checked) {
      this.connectionService
        .startConnection(
          this.ipAddress.value,
          this.clientData?.sendingPort,
          this.clientData?.clientId
        )
        .subscribe((res) => {
          this.connectionId = res.connectionId;
          this.connected = true;
          this.startMessageResultSSE();
        });
    } else {
      this.connectionService.stopMessageResultsSSE(
        this.connectionId,
        this.session_ClientId
      );
      this.connectionService
        .stopSendConnection(this.connectionId)
        .subscribe((res) => {
          this.connected = false;
        });
    }
  }

  sendMessages() {
    var messageList = this.messages.getValue();
    this.sendQueuedMessages(
      messageList.filter(
        (m) => m.message && m.messageStatus == MessageStatus.InQueue
      )
    );
  }

  private sendQueuedMessages(queuedMessages: IMessageModel[]) {
    queuedMessages.forEach((m) => (m.connectionId = this.connectionId));
    this.connectionService
      .sendMessages(queuedMessages)
      .subscribe((result) => {});
  }

  private startMessageResultSSE() {
    this.connectionService
      .messageResultsSSE(this.connectionId, this.session_ClientId)
      .subscribe((r) => {
        if (!r.connectionStatus) {
          this.connected = false;
          this.connectionService.stopMessageResultsSSE(
            this.connectionId,
            this.session_ClientId
          );
        }
        var messageList = this.messages.getValue();
        var index = messageList.findIndex((m) => m.messageId == r.messageId);
        if (index >= 0) {
          messageList[index] = r;
        }
        this._ngZone.run(() => {
          this.messages.next(messageList);
        });
      });
  }

  openNewMessageDialog() {
    const dialogRef = this.dialog.open(AddMessageComponent, {
      data: {},
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let newList = this.messages.getValue();
        newList.push({
          dateTime: '',
          response: '',
          message: result,
          messageStatus: MessageStatus.InQueue,
          connectionId: this.connectionId,
          messageId: uuidv4(),
        });
        this.messages.next(newList);
      }
    });
  }

  openAddFileDialog() {
    const dialogRef = this.dialog.open(AddFileComponent, {
      data: {},
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((files) => {
      if (files) {
        this.fileService
          .parseFiles(files, this.connectionId)
          .subscribe((newMessages) => {
            if (!newMessages) return;
            let messages = this.messages.getValue();
            newMessages.forEach((m) => messages.push(m));
            this._ngZone.run(() => {
              this.messages.next(messages);
            });
          });
      }
    });
  }

  openTemplateDialog() {
    const dialogRef = this.dialog.open(TemplateLibraryComponent, {
      data: {},
      width: '80%',
      height: '80%',
    });

    dialogRef
      .afterClosed()
      .subscribe((ret: { template: TemplateModel }) => {
        this.openTemplateEditDialog(ret.template);
      });
  }

  openTemplateEditDialog(template: TemplateModel) {
    const dialogRef = this.dialog.open(EditTemplateComponent, {
      data: {},
      width: '80%',
      height: '80%',
    });

    dialogRef
      .afterClosed()
      .subscribe((ret: { template: TemplateModel; count: number }) => {
        let messages = this.messages.getValue();
        let newMessage = generateMessages(ret.template, ret.count);
        newMessage.forEach((m) => {
          let model = {
            dateTime: '',
            response: '',
            message: m,
            messageStatus: MessageStatus.InQueue,
            connectionId: this.connectionId,
            messageId: uuidv4(),
          };
          messages.push(model);
        });
        this._ngZone.run(() => {
          this.messages.next(messages);
        });
      });
  }

  addTemplateDialog( ) {
    const dialogRef = this.dialog.open(TemplateAddComponent, {
      data: { template: null, clientId: this.clientData?.clientId },
      width: '80%',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((template) => {
      this.templateService.AddTemplate(template).subscribe((templdate) => {});
    });
  }

  canSend() {
    if (!this.connected) {
      return true;
    }

    if (
      this.messages
        .getValue()
        .some((m) => m.messageStatus == MessageStatus.InQueue)
    ) {
      return false;
    }
    return true;
  }
}
