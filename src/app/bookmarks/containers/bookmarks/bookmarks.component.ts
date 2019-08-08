import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Bookmark } from '../../models';
import { BookmarkServiceProvider } from '../../services/bookmark/bookmark.factory';
import { BookmarkService } from '../../services/bookmark/bookmark.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {

  bookmarks$: Observable<Bookmark[]>;

  constructor(@Inject(BookmarkServiceProvider) private bookmarkService: BookmarkService) { }

  ngOnInit() {
    this.bookmarks$ = this.bookmarkService.bookmarks$;
  }

  selectBookmark(bookmark: Bookmark) {
    this.bookmarkService.select(bookmark);
  }

}
