import { Component, EventEmitter, Output, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LazyImgDirective } from '../../directives/lazy-img.directive';
import { FaviconPipe } from '../../pipes/favicon.pipe';

@Component({
    selector: 'app-bookmark-list',
    templateUrl: './bookmark-list.component.html',
    styleUrls: ['./bookmark-list.component.css'],
    imports: [LazyImgDirective, DatePipe, FaviconPipe]
})
export class BookmarkListComponent {

  readonly bookmarks = input<chrome.bookmarks.BookmarkTreeNode[]>(undefined);
  readonly countBookmarks = input<number>(undefined);

  @Output() selectEvent = new EventEmitter<chrome.bookmarks.BookmarkTreeNode>();
  @Output() clearFilter = new EventEmitter<void>();

  trackByBookmark(_: number, bookmark: chrome.bookmarks.BookmarkTreeNode) {
    return bookmark.id;
  }

}
