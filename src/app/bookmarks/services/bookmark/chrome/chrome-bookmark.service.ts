import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { BookmarkService } from '../bookmark.service';

import { take } from 'rxjs/operators';
import { LoggerService } from '../../logger/logger.service';

const OTHER_BOOKMARKS = 'Other Bookmarks';
const READING_LIST_TITLE = 'My ReadingList';

@Injectable({
  providedIn: 'root'
})
export class ChromeBookmarkService implements BookmarkService {

  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;
  readingListId: string;

  private bookmarks = new BehaviorSubject<chrome.bookmarks.BookmarkTreeNode[]>([]);

  constructor(
    private logger: LoggerService
  ) {
    this.bookmarks$ = this.bookmarks.asObservable();
  }

  add(create: chrome.bookmarks.BookmarkCreateArg) {
    const bookmarkExists = this.exists(create.url);

    if (!bookmarkExists) {

      // always put it in the reading list
      create.parentId = this.readingListId;

      chrome.bookmarks.create(create, bookmark => {
        const copy = [...this.bookmarks.value];
        copy.push(bookmark);
        this.bookmarks.next(copy);
      });
    }
  }

  exists(url: string): boolean {
    return this.bookmarks.getValue().some(bookmark => url === bookmark.url);
  }

  load(): Observable<chrome.bookmarks.BookmarkTreeNode[]> {
    this.loadChromeBookmarks(READING_LIST_TITLE);

    return this.bookmarks$;
  }

  remove(remove: chrome.bookmarks.BookmarkTreeNode) {
    chrome.bookmarks.remove(remove.id, () => {
      const result = [...this.bookmarks.value].filter(bookmark => bookmark.id !== remove.id);

      this.bookmarks.next(result);
    });
  }

  select(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    window.open(bookmark.url, '_blank');
    this.remove(bookmark);
  }

  /**
   * Create a root node for the reading list items
   */
  private createReadinglistRoot(parent: chrome.bookmarks.BookmarkTreeNode, title: string): Observable<void> {
    const result = new Subject<void>();
    chrome.bookmarks.create({
      title,
      parentId: parent.id
    }, () => {
      result.next();
      result.complete();
    });

    return result.asObservable();
  }

  /**
   * returns the root node for the readinglist items.
   * When it does not exits, it will be created
   */
  private loadChromeBookmarks(title: string): Observable<chrome.bookmarks.BookmarkTreeNode[]> {
    chrome.bookmarks.getTree(bookmarks => {
      const result = bookmarks[0].children
        .find(child => child.title === OTHER_BOOKMARKS);
      if (result && result.children) {
        const match = result.children.find(bookmark => bookmark.title === title);
        if (match) {
          this.readingListId = match.id;

          this.logger.log('ChromeBookmarkService', 'loaded bookmarks', match.children);
          this.bookmarks.next([...match.children]);
        } else {
          this.createReadinglistRoot(result, title)
            .pipe(take(1))
            .subscribe(() => {
              // root has been created... try again
              this.loadChromeBookmarks(title);
            });
        }
      }
    });

    return this.bookmarks$;
  }
}
