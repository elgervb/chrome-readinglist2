import { Component, computed, effect, inject, signal } from '@angular/core';
import { share } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { VersionService } from '../../services/version/version.service';
import { Sorting } from '../../models/sorting';
import { environment } from '@env/environment';
import { GoogleAnalyticsService } from '@core/google-analytics.service';
import { BookmarkHeaderComponent } from '../../components/bookmark-header/bookmark-header.component';
import { BookmarkListComponent } from '../../components/bookmark-list/bookmark-list.component';
import { BookmarkFooterComponent } from '../../components/bookmark-footer/bookmark-footer.component';
import { DEFAULT_LAZY_IMAGE } from '../../directives';

const initialSorting: Sorting = {
  field: 'dateAdded',
  asc: true
};
export const DEFAULT_IMAGE = '/assets/bookmark-default.svg';

const chromeReviewUrl = 'https://chrome.google.com/webstore/detail/chrome-reading-list-2-%E2%9D%A4/kdapifmgfmpofpeoehdelijjcdpmgdja';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: [ './bookmarks.component.css' ],
  imports: [ BookmarkHeaderComponent, BookmarkListComponent, BookmarkFooterComponent ],
  providers: [ { provide: DEFAULT_LAZY_IMAGE, useValue: DEFAULT_IMAGE } ]
})
export class BookmarksComponent {

  private readonly analyticsService = inject(GoogleAnalyticsService);
  private readonly bookmarkService = inject(BookmarkService);
  private readonly versionService = inject(VersionService);

  readonly devMode = !environment.production;
  readonly version = this.versionService.getVersion();

  readonly filter = signal<string>('');
  readonly sorting = signal<Sorting>(initialSorting);
  readonly allBookmarks = toSignal(this.bookmarkService.bookmarks$.pipe(share()));
  readonly countBookmarks = computed(() => this.allBookmarks().length);
  readonly bookmarks = computed(() => {
    if (!this.allBookmarks()) {
      return [];
    }
    const bookmarks = this.filter() ? this.filterBookmarks(this.filter(), this.allBookmarks()) : [ ...this.allBookmarks() ];

    return bookmarks.sort((a, b) => this.sortBookmarks(a, b, this.sorting()));
  });

  currentUrlExists = signal(true);

  constructor() {
    chrome.storage.sync.get([ 'filter', 'sorting' ], data => {
      this.filter.set(data.filter);
      this.sorting.set(data.sorting);
    });

    this.bookmarkService.load();

    effect(() => chrome.action.setBadgeText({ text: `${this.allBookmarks().length}` }));
    effect(() => {
      if (this.bookmarks().length > 0) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const [ tab ] = tabs;
          this.currentUrlExists.set(this.bookmarkService.exists(tab.url));
        });
      }
    });
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

  applyFilter(filter: string): void {
    chrome.storage.sync.set({ filter });
    this.filter.set(filter);
  }

  randomBookmark(): void {
    const randomIndex = Math.floor(Math.random() * this.bookmarks().length);
    const bookmark = this.bookmarks()[randomIndex];
    this.selectBookmark(bookmark);
    this.analyticsService.sendEvent('bookmarks', 'random', bookmark.url);
  }

  reviewPopoverShown(show: boolean): void {
    this.analyticsService.sendEvent('review', show ? 'show popover' : 'hide popover');
  }

  openReview(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, () => {
      this.analyticsService.sendEvent('review', 'redirect');
      chrome.tabs.create({ url: chromeReviewUrl });
    });
  }

  selectBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode): void {
    chrome.tabs.query({ active: true, currentWindow: true }, () => {
      this.bookmarkService.remove(bookmark);
      this.analyticsService.sendEvent('bookmarks', 'select', bookmark.url);
      chrome.tabs.create({ url: bookmark.url });
    });
  }

  setSorting(field?: 'dateAdded' | 'title' | 'url'): void {
    const currentSorting = this.sorting();

    const sorting: Sorting = {
      field: field || currentSorting.field,
      asc: !currentSorting.asc
    };

    this.sorting.set(sorting);

    chrome.storage.sync.set({ sorting });
    this.analyticsService.sendEvent('bookmarks', 'sort', `${sorting.field}:${sorting.asc ? 'asc' : 'desc'}`);
  }

  private filterBookmarks(filter: string, bookmarks: chrome.bookmarks.BookmarkTreeNode[]): chrome.bookmarks.BookmarkTreeNode[] {
    return bookmarks.filter(bookmark => bookmark.title.toLowerCase().includes(filter) ||
      bookmark.url.toLowerCase().includes(filter));
  }

  private sortBookmarks(a: chrome.bookmarks.BookmarkTreeNode, b: chrome.bookmarks.BookmarkTreeNode, sort: Sorting): number {
    const right = sort.asc ? a : b;
    const left = sort.asc ? b : a;
    return (`${right[sort.field]}`).localeCompare(`${left[sort.field]}`);
  }

}
