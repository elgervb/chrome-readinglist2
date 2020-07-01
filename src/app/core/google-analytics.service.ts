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
  sendEvent(category: string, eventLabel: string, eventValue?: string) {
    this.ga('send', 'event', category, eventLabel, eventValue);
  }

  sendPageView(title: string) {
    this.ga('send', 'pageview', title);
  }

  private ga(...args: string[]): void {
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
