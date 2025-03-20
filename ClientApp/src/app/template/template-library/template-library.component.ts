import { Component, Input } from '@angular/core';
import { TemplateModel, parseMacros } from 'src/app/model/template-model';
import { TemplateService } from '../template.service';

@Component({
  selector: 'app-template-library',
  templateUrl: './template-library.component.html',
  styleUrls: ['./template-library.component.scss'],
})
export class TemplateLibraryComponent {
  templates: TemplateModel[] = [];
  template: TemplateModel | null = null;

  @Input('clientId') clientId: string = '';

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.templateService.loadAllTemplates().subscribe((result) => {
      this.templates = result;
      this.templates.forEach(t => { t.macros = parseMacros(t.body); })
    });
  }

  editTemplate(selected: TemplateModel) {

  }
}
