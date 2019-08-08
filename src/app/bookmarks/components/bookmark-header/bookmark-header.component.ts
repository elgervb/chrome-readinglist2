import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bookmark-header',
  templateUrl: './bookmark-header.component.html',
  styleUrls: ['./bookmark-header.component.css']
})
export class BookmarkHeaderComponent implements OnInit {

  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];

  @Output() addBookmark = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
