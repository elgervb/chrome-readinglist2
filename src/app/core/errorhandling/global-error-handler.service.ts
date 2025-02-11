import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable, Injector } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler extends ErrorHandler {

  private readonly injector = inject(Injector);


  handleError(error: Error | HttpErrorResponse): void {
    const gaService = this.injector.get<GoogleAnalyticsService>(GoogleAnalyticsService);
    if (error instanceof HttpErrorResponse) {
      // Server error happened
      if (!navigator.onLine) {
        // No Internet connection
        return;
      }
      // Http Error
      // Send the error to the server
      gaService.sendEvent('error', error.message, JSON.stringify(error));
      return;
    }
    // Client Error Happend
    // Send the error to the server
    gaService.sendEvent('error', error.message, JSON.stringify(error));

  }

}
