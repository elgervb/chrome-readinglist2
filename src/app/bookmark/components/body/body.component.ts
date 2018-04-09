import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  template: `
    <p>
      body works!
    </p>
  `,
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
