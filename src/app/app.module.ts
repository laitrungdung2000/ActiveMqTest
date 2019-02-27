import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActiveMqService } from './services/active-mq.service';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    RxStompService,
    ActiveMqService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
