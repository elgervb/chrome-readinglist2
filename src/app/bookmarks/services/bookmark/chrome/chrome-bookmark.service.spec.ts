import { TestBed } from '@angular/core/testing';

import { ChromeBookmarkService } from './chrome-bookmark.service';

describe('ChromeBookmarkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChromeBookmarkService = TestBed.get(ChromeBookmarkService);
    expect(service).toBeTruthy();
  });
});
