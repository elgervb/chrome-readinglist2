import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil, debounceTime } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { BookmarksService } from './bookmarks.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


const READINGLIST_BOOKMARK_NAME = 'My ReadingList';
export const DEFAULT_IMAGE = '/assets/bookmark-default.svg';

@Component({
  selector: 'app-root',
  template: `
    <header class="reading-list__header">
      <h1 class="reading-list__title">
      My Reading list
      <span class="reading-list__title--small">({{ bookmarks?.length || 0 }})</span>
      <span class="reading-list__version">0.0.1</span>
      </h1>
    </header>
    <main class="reading-list__body">
      <ul>
        <li *ngFor="let bookmark of bookmarks" class="bookmark">
          <a [href]="getSafeLink(bookmark)" (click)="onClick(bookmark, $event)" class="bookmark__link">
            <img [appLazyImg]="getFavicon(bookmark)" alt="Site's favicon" class="bookmark__favicon">
            <div class="bookmark__text">
              <div class="bookmark__title">{{ bookmark.title }}</div>
              <div class="bookmark__url">{{ bookmark.url }}</div>
            </div>
          </a>
        </li>
      </ul>
    </main>
    <footer class="reading-list__footer">
      <input type="text" class="reading-list__filter" placeholder="filter" autofocus (input)="applyFilter($event.target.value)">
      <button (click)="randomBookmark()" class="readinglist__btn-random" title="Pick a random item">↻</button>
      <button (click)="addCurrentPage()" class="readinglist__btn-add" title="Add current page">+</button>
    </footer>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;
  bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  private filter = new Subject<string>();
  private unsubscribe = new Subject<void>();

  constructor(private bookmarksService: BookmarksService, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    const filter$ = this.filter.asObservable().pipe(debounceTime(200));

    combineLatest(this.bookmarksService.bookmarks$, filter$, (bookmarks, filter) => {
      if (bookmarks) {
        return bookmarks.filter(bookmark => !filter || bookmark.title.includes(filter) || bookmark.url.includes(filter));
      }
      if (!filter) {
        return bookmarks;
      }
    })
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((bookmarks) => {
      this.bookmarks = bookmarks;
      this.changeDetector.detectChanges();
    });

    this.bookmarksService.get(READINGLIST_BOOKMARK_NAME);
    this.filter.next(undefined);
  }

  ngOnDestroy() {
    this.unsubscribe.next(undefined);
    this.unsubscribe.complete();
  }

  getSafeLink(bookmark: chrome.bookmarks.BookmarkTreeNode): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(bookmark.url);
  }

  onClick(bookmark: chrome.bookmarks.BookmarkTreeNode, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.create({url: bookmark.url});
      this.removeBookmark(bookmark);
    });
  }

  applyFilter(filter: string) {
    this.filter.next(filter);
  }

  getFavicon(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    const parsed = this.parse(bookmark.url);
    return `${this.getBase(parsed)}/favicon.ico`;
  }

  addCurrentPage() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0];
      this.bookmarksService.add({
        parentId: this.bookmarksService.readingListId,
        url: tab.url,
        title: tab.title,
      });
    });
  }

  randomBookmark() {
    this.bookmarks$.pipe(take(1)).subscribe(bookmarks => {
      const randomIndex = Math.floor(Math.random() * bookmarks.length);
      this.onClick(bookmarks[randomIndex]);
    });
  }

  removeBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    this.bookmarksService.remove(bookmark);
  }

  private parse(url): ParsedUrl {
    const parser = document.createElement('a');
    parser.href = url;

    return {
        protocol: parser.protocol, // => "http:"
        hostname: parser.hostname, // => "example.com"
        port: parseInt(parser.port, 10),     // => "3000"
        pathname: parser.pathname, // => "/pathname/"
        search: parser.search,   // => "?search=test"
        hash: parser.hash,     // => "#hash"
        host: parser.host     // => "example.com:3000"
    };
  }

  private getBase(parsed: ParsedUrl): string {
    let base = `${parsed.protocol}//${parsed.hostname}`;
    if (parsed.port) {
        base = `${base}:${parsed.port}`;
    }

    return base;
  }
}

interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: number;
  pathname: string;
  search: string;
  hash: string;
  host: string;
}
