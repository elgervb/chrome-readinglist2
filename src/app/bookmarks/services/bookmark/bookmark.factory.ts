import { InjectionToken } from '@angular/core';
import { LocalBookmarkService } from './local-bookmark.service';
import { BookmarkService } from './bookmark.service';

export const BookmarkServiceProvider = new InjectionToken<BookmarkService>('BookmarkService', {
  providedIn: 'root',
  factory: () => new LocalBookmarkService()
});
