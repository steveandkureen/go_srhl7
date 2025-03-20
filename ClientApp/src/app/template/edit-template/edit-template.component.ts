import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { TemplateMacro, TemplateModel, parseMacros } from 'src/app/model/template-model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent {
  template: TemplateModel;
  count: number = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { template: TemplateModel; clientId: string }
  ) {
    this.template = {
      templateId: uuidv4(),
      body: '',
      name: '',
      clientId: this.data.clientId,
      description: '',
      macros: []
    };
  }

  ngOnInit(): void {
    if (this.data.template) {
      this.template = this.data.template;
    }
  }

  updateMacros() {
    if (!this.template?.body) return;
    this.template.macros = parseMacros(this.template.body);
  }
}


