import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  imports: [ RouterOutlet ]
})
export class AppComponent {

  title = 'chrome-readinglist2';

  private readonly analyticsService = inject(GoogleAnalyticsService);

  constructor() {
    this.analyticsService.sendPageView('open popup');
  }

}
