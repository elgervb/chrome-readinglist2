import { AppComponent } from './app.component';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [ RouterOutlet ],
    mocks: [ GoogleAnalyticsService ]
  });

  beforeEach(() => spectator = createComponent());

  it('should register a page view with analytics', () => {
    expect(spectator.inject(GoogleAnalyticsService).sendPageView).toHaveBeenCalledWith('open popup');
  });
});
