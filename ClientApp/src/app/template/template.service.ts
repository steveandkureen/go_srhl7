import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TemplateModel, parseMacros } from '../model/template-model';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private clientService: ClientService
  ) {}

  loadAllTemplates(): Observable<TemplateModel[]> {
    let client = this.clientService.selectedClient;
    let clientId = client?.clientId;
    return this.http.get<TemplateModel[]>(
      this.baseUrl + `../api/templates/${clientId}`
    ).pipe(tap(r => { r.forEach(t => t.macros = parseMacros(t.body)); }));
  }

  loadTemplate(templateId: string): Observable<TemplateModel> {
    let client = this.clientService.selectedClient;
    let clientId = client?.clientId;
    return this.http.get<TemplateModel>(
      this.baseUrl + `../api/templates/${clientId}/${templateId}`
    ).pipe(tap(r => r.macros = parseMacros(r.body) ));
  }

  AddTemplate(template: TemplateModel): Observable<TemplateModel> {
    return this.http.post<TemplateModel>(
      this.baseUrl + `../api/templates`,
      template
    );
  }
}
