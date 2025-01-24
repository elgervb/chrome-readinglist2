import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, map, share, takeUntil, tap } from 'rxjs/operators';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { VersionService } from '../../services/version/version.service';
import { Sorting } from '../../models/sorting';
import { environment } from '@env/environment';
import { GoogleAnalyticsService } from '@core/google-analytics.service';
import { BookmarkHeaderComponent } from '../../components/bookmark-header/bookmark-header.component';
import { BookmarkListComponent } from '../../components/bookmark-list/bookmark-list.component';
import { BookmarkFooterComponent } from '../../components/bookmark-footer/bookmark-footer.component';
import { AsyncPipe } from '@angular/common';

const initialSorting: Sorting = {
  field: 'dateAdded',
  asc: true
};

const chromeReviewUrl = 'https://chrome.google.com/webstore/detail/chrome-reading-list-2-%E2%9D%A4/kdapifmgfmpofpeoehdelijjcdpmgdja';

@Component({
    selector: 'app-bookmarks',
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.css'],
    imports: [BookmarkHeaderComponent, BookmarkListComponent, BookmarkFooterComponent, AsyncPipe]
})
export class BookmarksComponent implements OnInit, OnDestroy {

  bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  sorting$ = new BehaviorSubject<Sorting>(initialSorting);
  currentUrlExists = true;
  /** the number of total (unfiltered) bookmarks */
  countBookmarks: number;
  /** filter the list of bookmarks with a search string */
  filter$ = new Subject<string>();

  get devMode() {
    return !environment.production;
  }

  get version() {
    return this.versionService.getVersion();
  }

  private destroy$ = new Subject<void>();

  constructor(
    private analyticsService: GoogleAnalyticsService,
    private bookmarkService: BookmarkService,
    private changeDetector: ChangeDetectorRef,
    private versionService: VersionService
  ) { }

  ngOnInit() {
    chrome.storage.sync.get([ 'filter', 'sorting' ], data => {
      this.filter$.next(data?.filter || '');
      this.sorting$.next(data?.sorting || initialSorting);
    });

    const filter$ = this.filter$.asObservable().pipe(debounceTime(200));
    const bookmarks$ = this.bookmarkService.bookmarks$.pipe(share());

    combineLatest([ bookmarks$, filter$, this.sorting$ ])
      .pipe(
        tap(([ allBookmarks ]) => this.countBookmarks = allBookmarks ? allBookmarks.length : 0),
        map(([ allBookmarks, filter, sort ]) => {
          if (!allBookmarks) {
            return undefined;
          }
          const bookmarks = filter ? this.filterBookmarks(filter, allBookmarks) : [ ...allBookmarks ];

          return bookmarks.sort((a, b) => this.sortBookmarks(a, b, sort));
        })
      )
      .subscribe(bookmarks => {
        this.bookmarks = bookmarks;
        this.changeDetector.detectChanges();
      });

    this.bookmarkService.load();
    this.filter$.next('');

    bookmarks$
      .pipe(
        // can current page be added?
        tap(() => {
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const [ tab ] = tabs;
            this.currentUrlExists = this.bookmarkService.exists(tab.url);

            this.changeDetector.detectChanges();
          });
        }),
        tap(bookmarks => chrome.action.setBadgeText({ text: `${bookmarks.length}` })),
        takeUntil(this.destroy$)
      ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addBookmark(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const [ tab ] = tabs;
      this.bookmarkService.add({
        url: tab.url,
        title: tab.title,
      });

      this.analyticsService.sendEvent('bookmarks', 'add', tab.url);
    });
  }

  applyFilter(filter: string) {
    chrome.storage.sync.set({ filter });
    this.filter$.next(filter);
  }

  randomBookmark() {
    const randomIndex = Math.floor(Math.random() * this.bookmarks.length);
    const bookmark = this.bookmarks[randomIndex];
    this.selectBookmark(bookmark);
    this.analyticsService.sendEvent('bookmarks', 'random', bookmark.url);
  }

  reviewPopoverShown(show: boolean) {
    this.analyticsService.sendEvent('review', show ? 'show popover' : 'hide popover');
  }

  openReview() {
    chrome.tabs.query({ active: true, currentWindow: true }, () => {
      this.analyticsService.sendEvent('review', 'redirect');
      chrome.tabs.create({ url: chromeReviewUrl });
    });
  }

  selectBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    chrome.tabs.query({ active: true, currentWindow: true }, () => {
      this.bookmarkService.remove(bookmark);
      this.analyticsService.sendEvent('bookmarks', 'select', bookmark.url);
      chrome.tabs.create({ url: bookmark.url });
    });
  }

  setSorting(field?: 'dateAdded' | 'title' | 'url') {
    const currentSorting = this.sorting$.getValue();

    const sorting: Sorting = {
      field: field || currentSorting.field,
      asc: !currentSorting.asc
    };

    this.sorting$.next(sorting);

    chrome.storage.sync.set({ sorting });
    this.analyticsService.sendEvent('bookmarks', 'sort', `${sorting.field}:${sorting.asc ? 'asc' : 'desc'}`);
  }

  private filterBookmarks(filter: string, bookmarks: chrome.bookmarks.BookmarkTreeNode[]) {
    return bookmarks.filter(bookmark => bookmark.title.toLowerCase().includes(filter) ||
      bookmark.url.toLowerCase().includes(filter));
  }

  private sortBookmarks(a: chrome.bookmarks.BookmarkTreeNode, b: chrome.bookmarks.BookmarkTreeNode, sort: Sorting) {
    const right = sort.asc ? a : b;
    const left = sort.asc ? b : a;
    return (`${right[sort.field]}`).localeCompare(`${left[sort.field]}`);
  }

}
