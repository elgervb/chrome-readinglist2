import { Component, OnInit, inject } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  private analyticsService = inject(GoogleAnalyticsService);


  title = 'chrome-readinglist2';

  ngOnInit() {
    this.analyticsService.sendPageView('open popup');
  }

}
