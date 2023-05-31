import { Component } from '@angular/core';
import { ClientModel } from '../model/client-model';
import { Router } from '@angular/router';
import { ClientModule } from '../client.module';
import { ClientService } from '../client.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientEditComponent } from '../client-edit/client-edit.component';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss'],
})
export class ClientHomeComponent {
  clients: ClientModel[] = [];

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientService
      .LoadClientData()
      .subscribe((results) => (this.clients = [...results]));
  }

  openClient(client: ClientModel) {
    this.clientService.selectClient(client);
    this.router.navigate([`connection/${client.clientId}`]);
  }

  addClient() {
    this.editClient({} as ClientModel);
  }

  editClient(client: ClientModel) {
    const dialogRef = this.dialog.open(ClientEditComponent, {
      data: { clientModel: client },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.clientId) {
          this.clientService.UpdateClient(result).subscribe();
        } else {
          this.clients.push(client);
          this.clientService.CreateClient(result).subscribe();
        }
      }
    });
  }
}
