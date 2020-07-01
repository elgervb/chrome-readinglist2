import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { VersionService } from '../../services/version/version.service';
import { Sorting } from '../../models/sorting';
import { environment } from 'src/environments/environment';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

const initialSorting: Sorting = {
  field: 'dateAdded',
  asc: true
};

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit, OnDestroy {

  bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  sorting$ = new BehaviorSubject<Sorting>(initialSorting);
  // TODO: move this to the header. It has all bookmarks, so it can check if it exists
  currentUrlExists = true;
  // the number of total (unfiltered) bookmarks
  countBookmarks: number;

  get version() {
    return this.versionService.getVersion();
  }

  get devMode() {
    return !environment.production;
  }

  private filter = new Subject<string>();
  private unsubscribe = new Subject<void>();

  constructor(
    private bookmarkService: BookmarkService,
    private versionService: VersionService,
    private analyticsService: GoogleAnalyticsService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const filter$ = this.filter.asObservable().pipe(debounceTime(200));

    combineLatest([this.bookmarkService.bookmarks$, filter$, this.sorting$])
      .pipe(
        tap(([allBookmarks, _, __]) => this.countBookmarks = allBookmarks ? allBookmarks.length : 0),
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

          return bookmarks.sort((a, b) => this.sortBookmarks(a, b, sort));
        })
      )
      .subscribe(bookmarks => {
        this.bookmarks = bookmarks;
        this.changeDetector.detectChanges();
      });

    this.bookmarkService.load();
    this.filter.next(undefined);

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

  addBookmark() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      this.bookmarkService.add({
        url: tab.url,
        title: tab.title,
      });

      this.analyticsService.sendEvent('bookmarks', 'add', 'bookmark');
    });
  }

  applyFilter(filter: string) {
    this.filter.next(filter);
  }

  randomBookmark() {
    const randomIndex = Math.floor(Math.random() * this.bookmarks.length);
    this.selectBookmark(this.bookmarks[randomIndex]);
    this.analyticsService.sendEvent('bookmarks', 'random', 'bookmark');
  }

  selectBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    chrome.tabs.query({ active: true, currentWindow: true }, () => {
      chrome.tabs.create({ url: bookmark.url });
      this.bookmarkService.remove(bookmark);
      this.analyticsService.sendEvent('bookmarks', 'select', 'bookmark');
    });
  }

  setSorting() {
    const currentSorting = this.sorting$.getValue();
    let sorting: Sorting;
    if (currentSorting.field === 'dateAdded') {
      sorting = {
        field: 'title',
        asc: true
      };
    } else if (currentSorting.field === 'title') {
      if (currentSorting.asc) {
        sorting = {
          field: 'title',
          asc: false
        };
      } else {
        sorting = {
          field: 'dateAdded',
          asc: true
        };
      }
    }

    this.sorting$.next(sorting);

    this.analyticsService.sendEvent('bookmarks', 'sort', `${sorting.field}:${sorting.asc ? 'asc' : 'desc'}`);
  }

  private sortBookmarks(a: chrome.bookmarks.BookmarkTreeNode, b: chrome.bookmarks.BookmarkTreeNode, sort: Sorting) {
    const right = sort.asc ? a : b;
    const left = sort.asc ? b : a;
    return ('' + right[sort.field]).localeCompare('' + left[sort.field]);
  }
}
