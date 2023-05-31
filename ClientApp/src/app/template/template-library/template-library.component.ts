import { Component, Input } from '@angular/core';
import { TemplateModel } from 'src/app/model/template-model';
import { TemplateService } from '../template.service';

@Component({
  selector: 'app-template-library',
  templateUrl: './template-library.component.html',
  styleUrls: ['./template-library.component.scss'],
})
export class TemplateLibraryComponent {
  templates: TemplateModel[] = [];
  template: TemplateModel | null = null;
  count: number = 1;
  @Input('clientId') clientId: string = '';

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.templateService.loadAllTemplates().subscribe((result) => {
      this.templates = result;
    });
  }

  editTemplate(selected: TemplateModel) {}
}
