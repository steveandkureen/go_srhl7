import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ConnectionStatus } from '../model/connection-status-model';
import { tap } from 'rxjs/internal/operators/tap';
import { AckTypes, IMessageModel } from '../model/message-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  resultsIntervalId: Map<string, NodeJS.Timer> = new Map<
    string,
    NodeJS.Timer
  >();
  resultsEventSource: Map<string, EventSource> = new Map<string, EventSource>();
  apiBaseUrl: string;
  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient
  ) {
    this.apiBaseUrl = this.baseUrl + '../api/';
  }

  startConnection(
    ipAddress: string | null,
    port: string | undefined,
    clientId: string | undefined
  ) {
    return this.http
      .post<ConnectionStatus>(this.apiBaseUrl + `connection`, {
        ipAddress: ipAddress,
        port: port,
        clientId: clientId,
        type: 'Sending',
      })
      .pipe(tap((res) => {}));
  }

  getConnectionStatus(connectionId: string) {
    return this.http.get(this.apiBaseUrl + `send?connectionId=${connectionId}`);
  }

  stopSendConnection(connectionId: string | null) {
    return this.http.delete<ConnectionStatus>(
      this.apiBaseUrl + `connection/${connectionId}`
    );
    // .pipe(tap(res => {
    //   this.http.delete<ConnectionStatus>(this.baseUrl + `connectionnotifications?connectionId=${connectionId}`).subscribe();
    // }));
  }

  startListening(
    ipAddress: string | undefined | null,
    port: string | undefined,
    ackType: string | null,
    clientId: string | undefined
  ) {
    return this.http
      .post<ConnectionStatus>(this.apiBaseUrl + `connection`, {
        ipAddress: ipAddress,
        port: port,
        clientId: clientId,
        type: 'Listenting',
      })
      .pipe(tap((res) => {}));
  }

  stopListening(connectionId: string) {
    return this.http.delete<ConnectionStatus>(
      this.apiBaseUrl + `connection/${connectionId}`
    );
  }

  stopReceiveMessagesSSE(connectionId: string, clientId: string) {
    let es = this.resultsEventSource.get(connectionId + '-listen');
    es?.close();
    // return this.http
    //    .delete(
    //       this.apiBaseUrl + `listenmessage/sse?connectionId=${connectionId}&clientid=${clientId}`
    //    )
    //    .subscribe()
  }

  sendMessages(messages: IMessageModel[]): Observable<IMessageModel[]> {
    return this.http.put<IMessageModel[]>(
      this.apiBaseUrl + `message`,
      messages
    );
  }

  messageResultsSSE(
    connectionId: string,
    clientId: string
  ): Observable<IMessageModel> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/x-ndjson');
    return new Observable((subscriber) => {
      const es = new EventSource(
        this.apiBaseUrl + `message/sse/${connectionId}/${clientId}`
      );
      es.onopen = (event) => {
        console.log('opened');
      };
      es.onmessage = (event) => {
        subscriber.next(JSON.parse(event.data));
      };
      es.onerror = (error) => {
        console.log(error);
      };
      this.resultsEventSource.set(connectionId + '-send', es);
    });
  }

  stopMessageResultsSSE(connectionId: string, clientId: string) {
    let es = this.resultsEventSource.get(connectionId + '-send');
    es?.close();
    // return this.http
    //    .delete(this.apiBaseUrl + `message/sse?connectionId=${connectionId}&clientid=${clientId}`)
    //    .subscribe()
  }
}
