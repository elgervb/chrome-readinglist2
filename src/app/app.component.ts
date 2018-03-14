import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil } from 'rxjs/operators';
import { BookmarksService } from './bookmarks.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


const READINGLIST_BOOKMARK_NAME = 'My ReadingList';

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
          <a [href]="getSafeLink(bookmark)" (click)="onClick(bookmark)" class="bookmark__link">
            <img [src]="getFavicon(bookmark)" alt="Site's favicon" class="bookmark__favicon">
            <div class="bookmark__text">
              <div class="bookmark__title">{{ bookmark.title }}</div>
              <div class="bookmark__url">{{ bookmark.url }}</div>
            </div>
          </a>
        </li>
      </ul>
    </main>
    <footer class="reading-list__footer">
      <input type="text" class="reading-list__filter" placeholder="filter" autofocus>
      <button (click)="randomBookmark()" class="readinglist__btn-random" title="Pick a random item">↻</button>
      <button (click)="addCurrentPage()" class="readinglist__btn-add" title="Add current page">+</button>
    </footer>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;
  bookmarks: chrome.bookmarks.BookmarkTreeNode[];

  private unsubscribe = new Subject<void>();

  constructor(private bookmarksService: BookmarksService, private sanitizer: DomSanitizer, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.bookmarks$ = this.bookmarksService.get(READINGLIST_BOOKMARK_NAME);

    this.bookmarks$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(bookmarks => {
        this.bookmarks = bookmarks;
        this.changeDetector.detectChanges();
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next(undefined);
    this.unsubscribe.complete();
  }

  getSafeLink(bookmark: chrome.bookmarks.BookmarkTreeNode): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(bookmark.url);
  }

  onClick(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.create({url: bookmark.url});
    });
  }

  getFavicon(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    // const parsed = this.parse(bookmark.url);
    // return `${this.getBase(parsed)}/favicon.ico`;
    return '/assets/bookmark-default.svg';
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
