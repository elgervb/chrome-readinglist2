import { Injectable } from '@angular/core';
import './ga';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  create(gaId: string): void {
    this.ga('create', gaId, 'auto');
  }

  /**
   * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
   */
  sendEvent(category: string, eventAction: string, eventLabel?: string, eventValue?: number): void {
    this.ga('send', 'event', category, eventAction, eventLabel, eventValue);
  }

  sendPageView(title: string): void {
    this.ga('send', 'pageview', title);
  }

  private ga(...args: (string | number)[]): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { ga } = window;
    if (ga) {
      ga(...args);
    } else {
      console.log('Google analytics not defined');
    }
  }

}
