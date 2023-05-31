import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ClientModel } from 'src/app/client/model/client-model';
import { ConnectionService } from '../connection.service';
import { IMessageModel } from 'src/app/model/message-model';

@Component({
  selector: 'app-send-view',
  templateUrl: './send-view.component.html',
  styleUrls: ['./send-view.component.scss']
})
export class SendViewComponent implements OnInit {
  @Input('client-data') clientData: ClientModel | null = null;
  @Input('messages')
  messages!: BehaviorSubject<IMessageModel[]>;
  constructor(private connectionService: ConnectionService) { }

  ngOnInit(): void {

  }

}
