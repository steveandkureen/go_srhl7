import { BrowserModule } from '@angular/platform-browser'
import { NgModule, isDevMode } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component'
import { NavMenuComponent } from './nav-menu/nav-menu.component'
import { HomeComponent } from './home/home.component'
import { FetchDataComponent } from './fetch-data/fetch-data.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ConnectionModule } from './connection/connection.module'
import { ConnectionComponent } from './connection/connection/connection.component'
import { ServiceWorkerModule } from '@angular/service-worker'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { ClientHomeComponent } from './client/client-home/client-home.component'
import { ClientModule } from './client/client.module'
import { SRHL7CommonModule } from './common/common.module'

@NgModule({
   declarations: [AppComponent, NavMenuComponent, HomeComponent, FetchDataComponent],
   imports: [
      BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
      HttpClientModule,
      FormsModule,
      ConnectionModule,
      MatToolbarModule,
      MatMenuModule,
      MatButtonModule,
      MatIconModule,
      SRHL7CommonModule,
      ClientModule,
      RouterModule.forRoot([
         { path: '', component: ClientHomeComponent, pathMatch: 'full' },
         { path: 'connection/:id', component: ConnectionComponent },
      ]),
      BrowserAnimationsModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
         enabled: !isDevMode(),
         // Register the ServiceWorker as soon as the application is stable
         // or after 30 seconds (whichever comes first).
         registrationStrategy: 'registerWhenStable:30000',
      }),
   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
