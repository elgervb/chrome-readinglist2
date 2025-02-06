import { GoogleAnalyticsService } from './google-analytics.service';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

describe('GoogleAnalyticsService', () => {
  let spectator: SpectatorService<GoogleAnalyticsService>;
  const createService = createServiceFactory({
    service: GoogleAnalyticsService,
  });


  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
