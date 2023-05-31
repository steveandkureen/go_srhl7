import { Inject, Injectable } from '@angular/core';
import { ClientModel } from './model/client-model';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  selectedClient: ClientModel | null = null;

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient
  ) {}

  LoadClientData(clientId: string = ''): Observable<ClientModel[]> {
    if (this.selectedClient?.clientId == clientId) {
      return of([this.selectedClient]);
    }
    if (clientId) {
      return this.http
        .get<ClientModel>(this.baseUrl + `../api/client/${clientId}`)
        .pipe(map((r) => [r]));
    } else {
      return this.http.get<ClientModel[]>(this.baseUrl + `../api/client`);
    }
  }

  CreateClient(model: ClientModel): Observable<ClientModel> {
    return this.http.post<ClientModel>(this.baseUrl + `../api/client`, model);
  }

  UpdateClient(model: ClientModel): Observable<ClientModel> {
    return this.http.put<ClientModel>(this.baseUrl + `../api/client`, model);
  }

  selectClient(model: ClientModel) {
    this.selectedClient = model;
  }
}
