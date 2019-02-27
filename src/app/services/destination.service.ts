import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private currentUserSubject = new BehaviorSubject('');
    currentUser = this.currentUserSubject.asObservable();

  constructor() { }

  changeDestination(destination: string) {
    this.currentUserSubject.next(destination);
  }
}
