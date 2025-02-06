import { HttpErrorInterceptor } from './http-error.interceptor';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

describe('HttpErrorInterceptor', () => {
  let spectator: SpectatorService<HttpErrorInterceptor>;
  const createService = createServiceFactory({
    service: HttpErrorInterceptor,
    mocks: [ GoogleAnalyticsService ]
  });

  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
