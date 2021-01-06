import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.css']
})
export class BookmarkListComponent implements OnInit {
  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  @Input() countBookmarks: number;

  @Output() selectEvent = new EventEmitter<chrome.bookmarks.BookmarkTreeNode>();
  @Output() clearFilter = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  trackByBookmark(_: number, bookmark: chrome.bookmarks.BookmarkTreeNode) {
    return bookmark.id;
  }
}
