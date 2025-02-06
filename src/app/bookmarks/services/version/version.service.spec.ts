import { VersionService } from './version.service';
jest.mock('@manifest_json', () => ({ version: '99.99.99.unittest' }));


import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

describe('VersionService', () => {
  let spectator: SpectatorService<VersionService>;
  const createService = createServiceFactory({
    service: VersionService,
    mocks: []
  });


  beforeEach(() => spectator = createService());

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });
});
