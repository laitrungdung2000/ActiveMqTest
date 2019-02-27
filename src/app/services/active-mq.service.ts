import { Injectable } from '@angular/core';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { RxStompState } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import  { User } from '../model/user';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class ActiveMqService {
  public data: Array<any>;
  public dataDestination: Array<any>
  private updateAppAction = new BehaviorSubject('');

  private subscription: Subscription;
  private websocketUrl: string;
  private destination: string;

  state: Observable<string>;
  messages: Observable<any>;
  updateAppEvent = this.updateAppAction.asObservable();
  constructor(
    private rxStompService: RxStompService,
  ) {
    this.checkProtocol();
   }

  connect() {
    let config: InjectableRxStompConfig = {
      brokerURL:`${this.websocketUrl}`,
      connectHeaders: {
        login: '',
        passcode: ''
      },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 10000,
      reconnectDelay: 2000,
      debug: (str) => {
        console.log(new Date(), str);
      }
    };

    this.rxStompService.configure(config);
    this.stompActivate();

    this.getSocketStatus();
    this.subscribeActiveMq();
  }

  private getSocketStatus() {
    this.state = this.rxStompService.connectionState$.pipe(
      map((state: number) => {
        console.log(`Current State: ${RxStompState[state]}`);
        return RxStompState[state];
      })
    );

    const MAX_RETRIES = 3;
    let numRetries = MAX_RETRIES;

    this.rxStompService.connectionState$.pipe(
      filter((state: number) => state === RxStompState.CLOSED)
    ).subscribe(() => {
      console.log(`Will retry ${numRetries} times`);
      if (numRetries <= 0) {
        this.stompDeActivate();
      }
      numRetries--;
    });

    this.rxStompService.connected$.subscribe(() => {
      numRetries = MAX_RETRIES;
    });
  }

  private stompActivate() {
    this.rxStompService.activate();
  }

  private stompDeActivate() {
    this.rxStompService.deactivate();
  }

  private subscribeActiveMq() {
    this.messages = this.rxStompService.watch(`/topic/${this.destination}`);
    this.subscription = this.messages.subscribe(this.on_next);
  }

  private on_next = (message: Message) => {
    console.log('message.body = ' + message.body);
    this.updateAppAction.next(message.body);
  }

  private checkProtocol() {
    let protocol = '';
    let port = '';

    if(window.location.protocol === 'https:') {
      protocol = 'wss:';
      port = '443';
    } else if (window.location.protocol === 'http:') {
      protocol = 'ws:';
      port = '61614';
    }
  }

  getData(data) {
    this.websocketUrl = data;
    console.log(`${this.websocketUrl}`);
  }
  getDestination(dataDestination) {
    this.destination = dataDestination;
    console.log(this.destination);
  }
}