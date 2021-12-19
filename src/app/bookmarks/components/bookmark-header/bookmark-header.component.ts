import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sorting } from '../../models/sorting';

@Component({
  selector: 'app-bookmark-header',
  templateUrl: './bookmark-header.component.html',
  styleUrls: [ './bookmark-header.component.css' ]
})
export class BookmarkHeaderComponent {

  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  @Input() sorting: Sorting;
  @Input() currentUrlExists: boolean;
  @Input() version: string;
  @Input() countBookmarks: number;

  @Output() addBookmark = new EventEmitter<void>();
  @Output() sortEvent = new EventEmitter<void>();

}
