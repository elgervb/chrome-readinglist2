import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.css']
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
