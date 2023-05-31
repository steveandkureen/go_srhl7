import { Component, Inject, Input } from '@angular/core';
import { ClientService } from '../client.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientModel } from '../model/client-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent {
  clientModel: ClientModel
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { clientModel: ClientModel },
              public dialogRef: MatDialogRef<ClientEditComponent>,
              private fb: FormBuilder,
              private clientService: ClientService) {
                this.clientModel = data.clientModel;
                this.form = new FormGroup({
                  name: new FormControl(this.clientModel.name, Validators.required),
                  ipAddresses: this.fb.array<string>(this.clientModel.ipAddresses || [''], Validators.minLength(1)),
                  sendingPort: new FormControl(this.clientModel.sendingPort, Validators.required),
                  listeningPort: new FormControl(this.clientModel.listeningPort, Validators.required),
                });
              }


  get ipAddresses() {
    return this.form.controls["ipAddresses"] as FormArray<FormControl>;
  }

  ngOnInit(): void {
  }

  saveClient() {
    if (this.form.valid) {
      this.clientModel = Object.assign(this.clientModel, this.form.value);
      this.dialogRef.close(this.clientModel);
    }
  }

  removeIpAddress(index: number) {
    this.ipAddresses.removeAt(index);
  }

  addIpAddress() {
    this.ipAddresses.push(new FormControl(''));
  }
}
