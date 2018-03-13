import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BookmarksService } from './bookmarks.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const READINGLIST_BOOKMARK_NAME = 'My ReadingList';

@Component({
  selector: 'app-root',
  template: `
    <header class="reading-list__header">
      <h1 class="reading-list__title">
      My Reading list
      <span class="reading-list__title--small">({{(bookmarks$|async)?.length || 0}})</span>
      <span class="reading-list__version">0.0.1</span>
      </h1>
    </header>
    <main class="reading-list__body">
      <ul>
        <li *ngFor="let bookmark of bookmarks$ | async" class="bookmark">
          <a [href]="getSafeLink(bookmark)" (click)="onClick(bookmark)" class="bookmark__link">
            <img [src]="getFavicon(bookmark)" alt="Site's favicon" class="bookmark__favicon">
            <div class="bookmark__text">
              <div class="bookmark__title">{{bookmark.title}}</div>
              <div class="bookmark__url">{{bookmark.url}}</div>
            </div>
          </a>
        </li>
      </ul>
    </main>
    <footer class="reading-list__footer">
      <input type="text" class="reading-list__filter" placeholder="filter" autofocus>
      <button ng-click="randomBookmark()" title="Reload reading list">↻</button>
      <button ng-click="addCurrentPage()" class="readinglist__btn-add" title="Add current page">+</button>
    </footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  bookmarks$: Observable<chrome.bookmarks.BookmarkTreeNode[]>;

  constructor(private bookmarksService: BookmarksService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.bookmarks$ = this.bookmarksService.get(READINGLIST_BOOKMARK_NAME);
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
    const parsed = this.parse(bookmark.url);
    return `${this.getBase(parsed)}/favicon.ico`;
  }

  addCurrentPage() {

  }

  randomBookmark() {

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

  private getBase(parsed): string {
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
