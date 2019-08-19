import { TestBed } from '@angular/core/testing';

import { VersionService } from './version.service';
jest.mock('src/manifest.json', () => ({ version: '99.99.99.unittest' }));

describe('VersionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VersionService = TestBed.get(VersionService);
    expect(service).toBeTruthy();
  });

  it('should return the version', () => {
    const service: VersionService = TestBed.get(VersionService);
    expect(service.getVersion()).toBe('99.99.99.unittest');
  });
});
