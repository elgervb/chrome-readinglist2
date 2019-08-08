import { Injectable } from '@angular/core';
import { Bookmark } from '../../models';
import { Observable, BehaviorSubject } from 'rxjs';
import { mockBookmarks } from './mock-data';
import { BookmarkService } from './bookmark.service';

@Injectable({
  providedIn: 'root'
})
export class LocalBookmarkService implements BookmarkService {

  readonly bookmarks$: Observable<Bookmark[]>;

  private bookmarkSubject = new BehaviorSubject<Bookmark[]>(mockBookmarks);

  constructor() {
    this.bookmarks$ = this.bookmarkSubject.asObservable();
  }

  add(url: string, title?: string) {
    const bookmark: Bookmark = { url, title };
    const bookmarks = [...this.bookmarkSubject.value, bookmark];
    this.bookmarkSubject.next(bookmarks);
  }

  select(bookmark: Bookmark) {
    window.open(bookmark.url, '_blank');
    this.remove(bookmark);
  }

  remove(bookmark: Bookmark) {
    const bookmarks = this.bookmarkSubject.value.filter(bm => bm.url !== bookmark.url);
    this.bookmarkSubject.next(bookmarks);
  }
}
