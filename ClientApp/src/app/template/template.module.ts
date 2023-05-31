import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateAddComponent } from './template-add/template-add.component';
import { TemplateLibraryComponent } from './template-library/template-library.component';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [TemplateAddComponent, TemplateLibraryComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  exports: [TemplateAddComponent, TemplateLibraryComponent],
})
export class TemplateModule {}
