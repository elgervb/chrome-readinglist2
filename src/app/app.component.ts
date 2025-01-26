import { Component, inject, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],

})
export class AppComponent implements OnInit {

  title = 'chrome-readinglist2';

  private readonly analyticsService = inject(GoogleAnalyticsService);

  ngOnInit(): void {
    this.analyticsService.sendPageView('open popup');
  }

}
