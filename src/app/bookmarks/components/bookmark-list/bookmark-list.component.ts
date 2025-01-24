import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { LazyImgDirective } from '../../directives/lazy-img.directive';
import { FaviconPipe } from '../../pipes/favicon.pipe';

@Component({
    selector: 'app-bookmark-list',
    templateUrl: './bookmark-list.component.html',
    styleUrls: ['./bookmark-list.component.css'],
    imports: [NgIf, NgFor, LazyImgDirective, DatePipe, FaviconPipe]
})
export class BookmarkListComponent {

  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  @Input() countBookmarks: number;

  @Output() selectEvent = new EventEmitter<chrome.bookmarks.BookmarkTreeNode>();
  @Output() clearFilter = new EventEmitter<void>();

  trackByBookmark(_: number, bookmark: chrome.bookmarks.BookmarkTreeNode) {
    return bookmark.id;
  }

}
