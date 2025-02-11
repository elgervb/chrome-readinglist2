import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { take } from 'rxjs/operators';
import { bookmarkFolderToken } from '../bookmark-folder.token';

export const OTHER_BOOKMARKS = 'Other Bookmarks';

/**
 * Service to manage bookmarks in a Chrome extension.
 *
 * @remarks
 * This service provides methods to add, remove, check existence, and load bookmarks using the Chrome bookmarks API.
 * It maintains an observable stream of bookmarks and ensures that bookmarks are added to a specific reading list folder.
 *
 * @example
 * ```typescript
 * const bookmarkService = inject(BookmarkService);
 *
 * // Add a new bookmark
 * bookmarkService.add({ title: 'Example', url: 'https://example.com' });
 *
 * // Remove a bookmark
 * bookmarkService.remove(bookmark);
 *
 * // Check if a bookmark exists
 * const exists = bookmarkService.exists('https://example.com');
 *
 * // Load bookmarks
 * bookmarkService.load().subscribe(bookmarks => {
 *   console.log(bookmarks);
 * });
 * ```
 *
 * @public
 */
@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;
  readingListId: string;

  private readonly bookmarkFolder = inject(bookmarkFolderToken);
  private readonly bookmarks = new BehaviorSubject<chrome.bookmarks.BookmarkTreeNode[]>([]);

  constructor() {
    if (!this.bookmarkFolder) {
      throw new Error('No bookmark folder set. Use InjectionToken bookmarkFolderToken');
    }
    this.bookmarks$ = this.bookmarks.asObservable();
  }

  /**
   * Adds a new bookmark to the reading list if it does not already exist.
   *
   * @param create - The bookmark creation arguments.
   * @remarks
   * This method checks if a bookmark with the given URL already exists. If it does not exist,
   * it sets the parentId to the reading list ID and creates the bookmark using the Chrome bookmarks API.
   * The newly created bookmark is then added to the current list of bookmarks.
   */
  add(create: chrome.bookmarks.BookmarkCreateArg): void {
    const bookmarkExists = this.exists(create.url);

    if (!bookmarkExists) {
      // always put it in the reading list
      create.parentId = this.readingListId;

      chrome.bookmarks.create(create, (bookmark => {
        const copy = [ ...this.bookmarks.value, bookmark ];
        this.bookmarks.next(copy);
      }));
    }
  }

  /**
   * Checks if a bookmark with the given URL exists in the bookmarks list.
   *
   * @param url - The URL of the bookmark to check.
   * @returns `true` if a bookmark with the given URL exists, otherwise `false`.
   */
  exists(url: string): boolean {
    return this.bookmarks.getValue().some(bookmark => url === bookmark.url);
  }

  /**
   * Loads the bookmarks from the Chrome bookmarks API and returns an observable
   * of the bookmark tree nodes.
   *
   * @returns {Observable<chrome.bookmarks.BookmarkTreeNode[]>} An observable that emits the bookmark tree nodes.
   */
  load(): Observable<chrome.bookmarks.BookmarkTreeNode[]> {
    this.loadChromeBookmarks(this.bookmarkFolder);

    return this.bookmarks$;
  }

  /**
   * Removes a bookmark from the Chrome bookmarks and updates the local bookmarks state.
   *
   * @param remove - The bookmark node to be removed.
   */
  remove(remove: chrome.bookmarks.BookmarkTreeNode): void {
    chrome.bookmarks.remove(remove.id, () => {
      const result = [ ...this.bookmarks.value ].filter(bookmark => bookmark.id !== remove.id);
      this.bookmarks.next(result);
    });
  }

  /**
   * Opens the given bookmark URL in a new browser tab and removes the bookmark.
   *
   * @param {chrome.bookmarks.BookmarkTreeNode} bookmark - The bookmark to be opened and removed.
   * @returns {void}
   */
  select(bookmark: chrome.bookmarks.BookmarkTreeNode): void {
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
        .find(child => child.title.toLowerCase() === OTHER_BOOKMARKS.toLowerCase());
      if (result?.children) {
        const match = result.children.find(bookmark => bookmark.title === title);
        if (match) {
          this.readingListId = match.id;

          this.bookmarks.next([ ...match.children ]);
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
