import { Component, HostListener, Input, NgZone } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ConnectionService } from '../connection.service'
import { AckTypes, IMessageModel } from 'src/app/model/message-model'
import { ClientModel } from 'src/app/client/model/client-model'
import { join } from 'path'
import { BehaviorSubject, Observable, map, startWith } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'

interface AckTypeSelection {
   value: AckTypes
   name: string
}

@Component({
   selector: 'app-receive-view-header',
   templateUrl: './receive-view-header.component.html',
   styleUrls: ['./receive-view-header.component.scss'],
})
export class ReceiveViewHeaderComponent {
   private _clientData: ClientModel | null = null
   @Input('client-data') set clientData(value: ClientModel | null) {
      this._clientData = value
      if (this.clientData && this.clientData.ipAddresses && this.clientData.ipAddresses.length) {
         this.ipAddress.setValue(this.clientData?.ipAddresses[0])
      }
   }
   get clientData(): ClientModel | null {
      return this._clientData
   }

   @HostListener('window:beforeunload', ['$event'])
   unloadHandler(event: Event) {
      this.connectionService.stopReceiveMessagesSSE(this.connectionId, this.session_ClientId)
   }

   private session_ClientId = uuidv4()

   @Input('messages')
   messages!: BehaviorSubject<IMessageModel[]>
   connectionId: string = ''
   connected = false
   ackType = new FormControl('0')
   ackTypes: AckTypeSelection[] = [
      { value: AckTypes.AA, name: 'AA' },
      { value: AckTypes.AE, name: 'AE' },
      { value: AckTypes.AR, name: 'AR' },
   ]

   ipAddress = new FormControl('')
   ipAddresses: string[] = []
   filteredOptions: Observable<string[]> | undefined

   constructor(private connectionService: ConnectionService, private _ngZone: NgZone) {}

   ngOnInit(): void {
      this.filteredOptions = this.ipAddress.valueChanges.pipe(
         startWith(''),
         map((value) => this._filter(value || ''))
      )
      if (this.clientData && this.clientData.ipAddresses && this.clientData.ipAddresses.length) {
         this.ipAddress.setValue(this.clientData?.ipAddresses[0])
      }
   }

   private _filter(value: string): string[] {
      const filterValue = value.toLowerCase()
      if (!this.clientData || !this.clientData.ipAddresses) return []

      return this.clientData.ipAddresses
   }

   connectButtonChagned(e: any) {
      if (e.checked) {
         this.connectionService
            .startListening(
               this.ipAddress.value,
               this.clientData?.listeningPort,
               this.ackType.value,
               this.clientData?.clientId
            )
            .subscribe((res) => {
               this.connectionId = res.connectionId
               this.connected = true
               this.connectionService
                  .messageResultsSSE(this.connectionId, this.session_ClientId)
                  .subscribe((result) => {
                     let messages = this.messages.getValue()
                     messages.push(result)
                     this._ngZone.run(() => {
                        this.messages.next(messages)
                     })
                  })
            })
      } else {
         this.connectionService.stopReceiveMessagesSSE(this.connectionId, this.session_ClientId)
         this.connectionService.stopListening(this.connectionId).subscribe((res) => {
            this.connectionId = ''
            this.connected = true
         })
      }
   }
}
