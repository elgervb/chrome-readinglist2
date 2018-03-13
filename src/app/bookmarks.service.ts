import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BookmarksService {

  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;
  private bookmarks = new Subject<chrome.bookmarks.BookmarkTreeNode[]>();

  constructor() {
    this.bookmarks$ = this.bookmarks.asObservable();
  }

  get(title: string): Observable<chrome.bookmarks.BookmarkTreeNode[]> {
    const OTHER_BOOKMARKS = 'Other bookmarks';
    chrome.bookmarks.getTree(bookmarks => {
      const result = bookmarks[0].children
        .find(child => child.title === OTHER_BOOKMARKS);

      if (result && result.children) {
        const match = result.children.find(bookmark => bookmark.title === title );
        this.bookmarks.next([...match.children]);

        console.log('BookmarksService.getBookmarks', match.children.length, 'results', match.children);
      }
    });

    return this.bookmarks$;
  }

  add(bookmark: chrome.bookmarks.BookmarkCreateArg) {
    chrome.bookmarks.create(bookmark);
  }
}
