import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  template: `
    <app-bookmark></app-bookmark>
  `,
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements OnInit {

  ngOnInit() {}
}
