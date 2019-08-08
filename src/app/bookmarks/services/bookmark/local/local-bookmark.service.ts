import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { mockBookmarks } from './mock-data';
import { BookmarkService } from '../bookmark.service';

@Injectable({
  providedIn: 'root'
})
export class LocalBookmarkService implements BookmarkService {

  readonly bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;

  private bookmarkSubject = new BehaviorSubject<chrome.bookmarks.BookmarkTreeNode[]>([]);

  constructor() {
    this.bookmarks$ = this.bookmarkSubject.asObservable();
  }

  add(create: chrome.bookmarks.BookmarkCreateArg) {
    if (!this.exists(create.url)) {
      const bookmark: chrome.bookmarks.BookmarkTreeNode = {
        id: this.guid(),
        url: create.url,
        title: create.title
      };
      const bookmarks = [...this.bookmarkSubject.value, bookmark];
      this.bookmarkSubject.next(bookmarks);
    }
  }

  exists(url: string): boolean {
    return this.bookmarkSubject.value.some(bookmark => url === bookmark.url);
  }

  load(): Observable<chrome.bookmarks.BookmarkTreeNode[]> {
    this.bookmarkSubject.next(mockBookmarks);

    return this.bookmarks$;
  }

  select(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    window.open(bookmark.url, '_blank');
    this.remove(bookmark);
  }

  remove(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    const bookmarks = this.bookmarkSubject.value.filter(bm => bm.id !== bookmark.id);
    this.bookmarkSubject.next(bookmarks);
  }

  private guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line: one-variable-per-declaration no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
