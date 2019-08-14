import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.css']
})
export class BookmarkListComponent implements OnInit, OnChanges {
  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  @Input() countBookmarks: number;

  @Output() selectEvent = new EventEmitter<chrome.bookmarks.BookmarkTreeNode>();

  constructor(
    private logger: LoggerService
  ) { }

  ngOnInit() { }

  ngOnChanges(): void {
    this.logger.log('BookmarkListComponent', `render ${this.bookmarks ? this.bookmarks.length : 0} bookmarks`);
  }

  trackByBookmark(_: number, bookmark: chrome.bookmarks.BookmarkTreeNode) {
    console.log(_, bookmark);
    return bookmark.id;
  }
}
