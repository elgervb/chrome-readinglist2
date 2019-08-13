import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bookmark-header',
  templateUrl: './bookmark-header.component.html',
  styleUrls: ['./bookmark-header.component.css']
})
export class BookmarkHeaderComponent implements OnInit {

  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  @Input() isSorted: boolean;
  @Input() currentUrlExists: boolean;

  @Output() addBookmark = new EventEmitter<void>();
  @Output() sortEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }
}
