import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.css']
})
export class BookmarkListComponent implements OnInit {

  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];

  @Output() selectEvent = new EventEmitter<chrome.bookmarks.BookmarkTreeNode>();

  constructor() { }

  ngOnInit() {
  }

}
