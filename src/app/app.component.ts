import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BookmarksService } from './bookmarks.service';

const READINGLIST_BOOKMARK_NAME = 'My ReadingList';

@Component({
  selector: 'app-root',
  template: `<h1>My Reading list ({{(bookmarks$|async)?.length || 0}})</h1>
    <ul>
      <li *ngFor="let bookmark of bookmarks$ | async">{{bookmark.title}}</li>
    </ul>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;

  constructor(private bookmarksService: BookmarksService) {}

  ngOnInit() {
    this.bookmarks$ = this.bookmarksService.getBookmarks(READINGLIST_BOOKMARK_NAME);
  }
}
