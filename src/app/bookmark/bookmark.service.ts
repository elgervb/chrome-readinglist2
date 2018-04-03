import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BookmarkService {
  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;
  readingListId: string;
  private bookmarks = new BehaviorSubject<chrome.bookmarks.BookmarkTreeNode[]>(undefined);

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
        this.readingListId = match.id;
        this.bookmarks.next([...match.children]);
      }
    });

    return this.bookmarks$;
  }

  add(create: chrome.bookmarks.BookmarkCreateArg) {
    const bookmarkExists = this.exists(create.url);

    if (!bookmarkExists) {
      chrome.bookmarks.create(create, bookmark => {
        const copy = [...this.bookmarks.value];
        copy.push(bookmark);
        this.bookmarks.next(copy);
      });
    }
  }

  exists(url: string) {
    return this.bookmarks.getValue().some(bookmark => url === bookmark.url);
  }

  remove(remove: chrome.bookmarks.BookmarkTreeNode) {
    chrome.bookmarks.remove(remove.id, () => {
      const result = [...this.bookmarks.value].filter(bookmark => bookmark.id !== remove.id);

      this.bookmarks.next(result);
    });
  }
}
