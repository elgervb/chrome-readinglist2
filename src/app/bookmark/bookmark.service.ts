import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

const OTHER_BOOKMARKS = 'Other bookmarks';

@Injectable()
export class BookmarkService {
  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;
  readingListId: string;
  private bookmarks = new BehaviorSubject<chrome.bookmarks.BookmarkTreeNode[]>(undefined);

  constructor() {
    this.bookmarks$ = this.bookmarks.asObservable();
  }

  /**
   * returns the root node for the readinglist items.
   * When it does not exits, it will be created
   */
  getRootnode(title: string): Observable<chrome.bookmarks.BookmarkTreeNode[]> {
    chrome.bookmarks.getTree(bookmarks => {
      const result = bookmarks[0].children
        .find(child => child.title === OTHER_BOOKMARKS);
      if (result && result.children) {
        const match = result.children.find(bookmark => bookmark.title === title );
        if (match) {
        this.readingListId = match.id;
        this.bookmarks.next([...match.children]);
        } else {
          this.createReadinglistRoot(result, title)
            .subscribe(() => {
              // root has been created... try again
              this.getRootnode(title);
            });
        }
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

  /**
   * Create a root node for the reading list items
   */
  private createReadinglistRoot(parent: chrome.bookmarks.BookmarkTreeNode, title: string): Observable<void> {
    const result = new Subject<void>();
    chrome.bookmarks.create({
      title,
      parentId:  parent.id
    }, () => {
      result.next();
      result.complete();
    });

    return result.asObservable();
  }
}
