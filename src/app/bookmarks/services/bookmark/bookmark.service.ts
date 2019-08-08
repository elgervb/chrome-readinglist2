import { Observable } from 'rxjs';

export interface BookmarkService {

  readonly bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;

  add(create: chrome.bookmarks.BookmarkCreateArg): void;

  exists(url: string): boolean;

  remove(bookmark: chrome.bookmarks.BookmarkTreeNode): void;

  select(bookmark: chrome.bookmarks.BookmarkTreeNode): void;
}
