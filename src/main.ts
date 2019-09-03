import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { GoogleAnalytics } from './app/core/analytics.service';

if (environment.production) {
  enableProdMode();
}

// Mock GoogleAnalytics
if (!environment.production) {
  const analytics: GoogleAnalytics = {
    getService: () => ({
      getTracker: () => ({
        sendAppView: () => {},
        sendEvent: () => {}
      })
    })
  };
  // tslint:disable: no-string-literal
  // @ts-ignore
  window['analytics'] = analytics;
  // tslint:enable: no-string-literal
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
