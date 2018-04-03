import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-bookmark-item',
  template: `
    <a class="bookmark__link"
      [href]="getSafeLink(bookmark)"
      [title]="getHover(bookmark)"
      (click)="onClick(bookmark, $event)">

      <img [appLazyImg]="getFavicon(bookmark)" alt="Site's favicon" class="bookmark__favicon">
      <div class="bookmark__text">
        <div class="bookmark__title">{{ bookmark.title }}</div>
        <div class="bookmark__url">{{ bookmark.url }}</div>
      </div>
    </a>
  `,
  styleUrls: ['./bookmarkitem.component.scss']
})
export class BookmarkitemComponent {

  @Input() bookmark: chrome.bookmarks.BookmarkTreeNode;

  @Output() select = new EventEmitter<chrome.bookmarks.BookmarkTreeNode>();

  constructor(private sanitizer: DomSanitizer) { }

  getFavicon(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    const parsed = this.parse(bookmark.url);
    return `${this.getBase(parsed)}/favicon.ico`;
  }

  getHover(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    const addDate = new Date(bookmark.dateAdded).toLocaleDateString();
    return `${bookmark.title}\nAdded on ${addDate}`;
  }

  getSafeLink(bookmark: chrome.bookmarks.BookmarkTreeNode): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(bookmark.url);
  }

  onClick(bookmark: chrome.bookmarks.BookmarkTreeNode, $event: MouseEvent) {
    $event.preventDefault();

    this.select.emit(bookmark);
  }

  private parse(url: string): ParsedUrl {
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
