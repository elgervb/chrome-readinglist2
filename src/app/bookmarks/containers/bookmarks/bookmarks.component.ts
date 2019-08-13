import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { BookmarkServiceProvider } from '../../services/bookmark/bookmark.factory';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit, OnDestroy {

  bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  isSorted = new BehaviorSubject<boolean>(false);
  currentUrlExists = true;

  private filter = new Subject<string>();
  private unsubscribe = new Subject<void>();

  constructor(
    @Inject(BookmarkServiceProvider) private bookmarkService: BookmarkService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const filter$ = this.filter.asObservable().pipe(debounceTime(200));

    combineLatest(this.bookmarkService.bookmarks$, filter$, this.isSorted)
      .pipe(
        map(([allBookmarks, filter, sort]) => {
          if (!allBookmarks) {
            return undefined;
          }
          let bookmarks = [...allBookmarks];
          if (filter) {
            bookmarks = allBookmarks.filter(bookmark =>
              !filter
              || bookmark.title.toLowerCase().includes(filter)
              || bookmark.url.toLowerCase().includes(filter));
          }

          if (sort) {
            return bookmarks.sort((a, b) => ('' + a.title).localeCompare(b.title));
          }

          return bookmarks;
        })
      )
      .subscribe(bookmarks => {
        this.bookmarks = bookmarks;
        this.changeDetector.detectChanges();
      });

    this.bookmarkService.load();
    this.filter.next(undefined);
    this.isSorted.next(false);

    this.bookmarkService.bookmarks$.subscribe(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        this.currentUrlExists = this.bookmarkService.exists(tab.url);

        this.changeDetector.detectChanges();
      });
    });

  }

  ngOnDestroy() {
    this.unsubscribe.next(undefined);
    this.unsubscribe.complete();
  }

  selectBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    chrome.tabs.query({ active: true, currentWindow: true }, () => {
      chrome.tabs.create({ url: bookmark.url });
      this.bookmarkService.remove(bookmark);
    });
  }

  applyFilter(filter: string) {
    this.filter.next(filter);
  }

  addBookmark() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      this.bookmarkService.add({
        url: tab.url,
        title: tab.title,
      });
    });
  }

  randomBookmark() {
    const randomIndex = Math.floor(Math.random() * this.bookmarks.length);
    this.selectBookmark(this.bookmarks[randomIndex]);
  }

  sort() {
    this.isSorted.next(!this.isSorted.getValue());
  }
}
