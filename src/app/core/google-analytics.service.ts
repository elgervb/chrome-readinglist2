import { Injectable } from '@angular/core';
import '@core/ga';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  create(gaId: string) {
    this.ga('create', gaId, 'auto');
  }

  /**
   * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
   */
  sendEvent(category: string, eventAction: string, eventLabel?: string, eventValue?: number) {
    this.ga('send', 'event', category, eventAction, eventLabel, eventValue);
  }

  sendPageView(title: string) {
    this.ga('send', 'pageview', title);
  }

  private ga(...args: (string | number)[]): void {
    // tslint:disable: no-string-literal
    // @ts-ignore
    const ga = window['ga'];
    if (ga) {
      ga(...args);
    } else {
      console.log('Google analytics not defined');
    }
  }
}
