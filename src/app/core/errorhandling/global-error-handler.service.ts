import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler extends ErrorHandler {
  private injector = inject(Injector);


  handleError(error: Error | HttpErrorResponse) {
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
