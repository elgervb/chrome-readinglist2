import { Injectable } from '@angular/core';
import * as manifest from 'src/manifest.json';

declare let analytics: GoogleAnalytics;

export interface GoogleAnalytics {
  getService(appName: string): GoogleAnalyticsService;
}

export interface GoogleAnalyticsService {
  getTracker(gaTrackingId: string): GoogleAnalyticsTracker;
}

export interface GoogleAnalyticsTracker {
  sendAppView(screenName: string): void;
  sendEvent(category: string, action: string, label?: string, value?: number): void;
}

/**
 * Service for http://googlearchive.github.io/chrome-platform-analytics/namespace_analytics.html
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private tracker: GoogleAnalyticsTracker;

  constructor() { }

  init(gaTrackingId: string) {
    const service = analytics.getService(manifest.name);
    this.tracker = service.getTracker(gaTrackingId);
  }

  sendAppView(screenName: string) {
    this.tracker.sendAppView(screenName);
  }

  sendEvent(category: string, action: string, label?: string, value?: number) {
    this.sendEvent(category, action, label, value);
  }
}
