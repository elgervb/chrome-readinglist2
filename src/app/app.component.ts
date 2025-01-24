import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {

  title = 'chrome-readinglist2';

  constructor(private analyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.analyticsService.sendPageView('open popup');
  }

}
