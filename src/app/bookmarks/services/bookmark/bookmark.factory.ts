import { InjectionToken, inject } from '@angular/core';
import { LocalBookmarkService } from './local/local-bookmark.service';
import { BookmarkService } from './bookmark.service';
import { ChromeBookmarkService } from './chrome/chrome-bookmark.service';
import { LoggerService } from '../logger/logger.service';

export const BookmarkServiceProvider = new InjectionToken<BookmarkService>('BookmarkService', {
  providedIn: 'root',
  factory: () => chrome && chrome.bookmarks ? new ChromeBookmarkService(inject(LoggerService)) : new LocalBookmarkService()
});
