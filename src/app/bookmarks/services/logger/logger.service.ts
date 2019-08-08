import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  // tslint:disable-next-line: no-any
  log(...msg: any) {
    console.log(...msg);
  }
}
