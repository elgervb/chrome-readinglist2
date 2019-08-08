import { TestBed } from '@angular/core/testing';
import { LocalBookmarkService } from './local-bookmark.service';

describe('BookmarkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalBookmarkService = TestBed.get(LocalBookmarkService);
    expect(service).toBeTruthy();
  });
});
