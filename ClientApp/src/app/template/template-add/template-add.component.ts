import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import {
  TemplateMacro,
  TemplateModel,
  parseMacro,
  MacroType,
  parseMacros,
} from 'src/app/model/template-model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-template-add',
  templateUrl: './template-add.component.html',
  styleUrls: ['./template-add.component.scss'],
})
export class TemplateAddComponent {
  template: TemplateModel;
  macros: BehaviorSubject<TemplateMacro[]> = new BehaviorSubject<
    TemplateMacro[]
  >([]);

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
    };
  }

  ngOnInit(): void {
    if (this.data.template) {
      this.template = this.data.template;
    }
  }

  updateMacros() {
    if (!this.template?.body) return;
    this.macros.next(parseMacros(this.template.body));
  }
}
