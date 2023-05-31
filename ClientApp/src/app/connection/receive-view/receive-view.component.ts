import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClientModel } from 'src/app/client/model/client-model';
import { IMessageModel } from 'src/app/model/message-model';

@Component({
  selector: 'app-receive-view',
  templateUrl: './receive-view.component.html',
  styleUrls: ['./receive-view.component.scss']
})
export class ReceiveViewComponent implements OnInit {
  @Input('client-data') clientData: ClientModel | null = null;
  @Input('messages')
  messages!: BehaviorSubject<IMessageModel[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
