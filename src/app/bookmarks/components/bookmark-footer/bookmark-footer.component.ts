import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-bookmark-footer',
  templateUrl: './bookmark-footer.component.html',
  styleUrls: ['./bookmark-footer.component.css']
})
export class BookmarkFooterComponent implements OnInit {

  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];

  @Output() readonly filterEvent = new EventEmitter<string>();
  @Output() readonly randomBookmarkEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

}
