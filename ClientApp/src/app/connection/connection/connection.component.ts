import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ClientService } from 'src/app/client/client.service';
import { ClientModel } from 'src/app/client/model/client-model';
import { IMessageModel } from 'src/app/model/message-model';
import { ConnectionService } from '../connection.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent {
  panelOpenState = false;
  clientId: string = '';
  clientData: BehaviorSubject<ClientModel> = new BehaviorSubject({});
  sendMessages: BehaviorSubject<IMessageModel[]> = new BehaviorSubject<
    IMessageModel[]
  >([]);
  receiveMessages: BehaviorSubject<IMessageModel[]> = new BehaviorSubject<
    IMessageModel[]
  >([]);

  constructor(
    private route: ActivatedRoute,
    private connectionService: ConnectionService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.clientId = params['id']; // (+) converts string 'id' to a number

      this.clientService.LoadClientData(this.clientId).subscribe((data) => {
        if (data.length) {
          this.clientData.next(data[0]);
          this.clientService.selectClient(data[0]);
        }
      });
    });
  }

  killServerConnections() {
    this.connectionService.stopListening(this.clientId);
    this.connectionService.stopSendConnection(this.clientId);
  }
}
