import { Component, EventEmitter, Output, input } from '@angular/core';
import { Sorting } from '../../models/sorting';


@Component({
    selector: 'app-bookmark-header',
    templateUrl: './bookmark-header.component.html',
    styleUrls: ['./bookmark-header.component.css']
})
export class BookmarkHeaderComponent {

  readonly bookmarks = input<chrome.bookmarks.BookmarkTreeNode[]>(undefined);
  readonly sorting = input<Sorting>(undefined);
  readonly currentUrlExists = input<boolean>(undefined);
  readonly version = input<string>(undefined);
  readonly countBookmarks = input<number>(undefined);

  @Output() addBookmark = new EventEmitter<void>();
  @Output() sortEvent = new EventEmitter<void>();

}
