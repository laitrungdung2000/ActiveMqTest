import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators} from '@angular/forms';

import { ActiveMqService } from './services/active-mq.service';
import { User } from './model/user'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public data: Array<User>
  public dataDestination: Array<any>
  apps: any = [];
  loginForm: FormGroup;
  submitted = false;
  destination: string;
  webSocketUrl: string;

    constructor(
      private activemqService: ActiveMqService,
      private formBuilder: FormBuilder,
    ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      webSocketUrl: ['',Validators.required],
      destination: ['', Validators.required],
      user: [''],
      password: ['']
    });
    this.activemqService.updateAppEvent.subscribe((data: string) => {
      if(data) { this.updateAppFromServer(data); }
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if(this.loginForm.invalid) {
      return;
    }
    this.data = this.loginForm.value.webSocketUrl;
    this.dataDestination = this.loginForm.value.destination;
    this.activemqService.getData(this.data);
    this.activemqService.getDestination(this.dataDestination);
    this.activemqService.connect();

  }

  private updateAppFromServer(data: string) {
    const jsonObject = JSON.parse(data);
    for( let i = 0; i < this.apps.length; i++) {
      if(this.apps[i].objectId === jsonObject.objectId) {
        this.apps[i] = jsonObject;
      }
    }
  }

  connect() {
  }
}
