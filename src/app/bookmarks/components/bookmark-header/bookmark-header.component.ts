import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bookmark-header',
  templateUrl: './bookmark-header.component.html',
  styleUrls: ['./bookmark-header.component.css']
})
export class BookmarkHeaderComponent implements OnInit {

  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];

  constructor() { }

  ngOnInit() {
  }

}
