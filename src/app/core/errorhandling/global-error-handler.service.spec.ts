import { GlobalErrorHandler } from './global-error-handler.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

describe('GlobalErrorHandler', () => {
  let spectator: SpectatorService<GlobalErrorHandler>;
  const createService = createServiceFactory({
    service: GlobalErrorHandler,
    mocks: []
  });


  beforeEach(() => spectator = createService());

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
