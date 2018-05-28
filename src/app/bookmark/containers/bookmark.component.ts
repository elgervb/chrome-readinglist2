import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { BookmarkService } from '../bookmark.service';

const READINGLIST_BOOKMARK_NAME = 'My ReadingList';

@Component({
  selector: 'app-bookmark',
  template: `
    <header class="reading-list__header">
      <h1 class="reading-list__title">
        <span>My Reading list
          <span class="reading-list__title--small">({{ bookmarks?.length || 0 }})</span>
        </span>
        <span>
          <span class="reading-list__version">0.0.1</span>
          <svg class="icon icon--sort" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            [ngClass]="{'icon--sort__asc':!(isSorted| async), 'icon--sort__desc': isSorted| async}"
            (click)="sort()">
            <g>
              <path class="icon--sort__up"
                d="m496.1,138.3l-120.4-120.4c-7.9-7.9-20.6-7.9-28.5-7.10543e-15l-120.3,
                120.4c-7.9,7.9-7.9,20.6 0,28.5 7.9,7.9 20.6,7.9 28.5,0l85.7-85.7v352.8c0,
                11.3 9.1,20.4 20.4,20.4 11.3,0 20.4-9.1 20.4-20.4v-352.8l85.7,85.7c7.9,
                7.9 20.6,7.9 28.5,0 7.9-7.8 7.9-20.6 5.68434e-14-28.5z"/>
              <path class="icon--sort__down"
                d="m287.1,347.2c-7.9-7.9-20.6-7.9-28.5,0l-85.7,85.7v-352.8c0-11.3-9.1-20.4-20.4-20.4-11.3,
                0-20.4,9.1-20.4,20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5,0-7.9,7.9-7.9,20.6 0,
                28.5l120.4,120.4c7.9,7.9 20.6,7.9 28.5,0l120.4-120.4c7.8-7.9 7.8-20.7-0.1-28.5l0,0z"/>
            </g>
          </svg>
        </span>
      </h1>
      <button class="readinglist__btn-add" title="Add current page"
        [disabled]="currentUrlExists"
        (click)="addCurrentPage()">
          <svg class="icon icon--plus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <g>
              <line class="st1" x1="257" x2="257" y1="53" y2="461"/>
              <line class="st1" x1="461" x2="53" y1="257" y2="257"/>
            </g>
            <g id="cross_copy">
              <path d="M461,249H265V53c0-4.418-3.582-8-8-8c-4.418,0-8,3.582-8,8v196H53c-4.418,0-8,3.582-8,8c0,4.418,3.582,8,8,8h196v196
                c0,4.418,3.582,8,8,8c4.418,0,8-3.582,8-8V265h196c4.418,0,8-3.582,8-8C469,252.582,465.418,249,461,249z"/>
            </g>
          </svg>
        </button>
    </header>
    <main class="reading-list__body">
      <ul>
        <li *ngFor="let bookmark of bookmarks" class="list__item">
          <app-bookmark-item
            [bookmark]="bookmark"
            (select)="select($event)">
          </app-bookmark-item>
        </li>
      </ul>
    </main>
    <footer class="reading-list__footer">
      <input type="text" class="reading-list__filter" placeholder="filter" autofocus (input)="applyFilter($event.target.value)">
      <button class="readinglist__btn-random" title="Pick a random item"
        (click)="randomBookmark()"
        [disabled]="!bookmarks?.length">↻</button>
    </footer>
  `,
  styleUrls: ['./bookmark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkComponent implements OnInit, OnDestroy {
  bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  isSorted = new BehaviorSubject<boolean>(false);
  currentUrlExists = true;

  private filter = new Subject<string>();
  private unsubscribe = new Subject<void>();

  constructor(private bookmarkService: BookmarkService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    const filter$ = this.filter.asObservable().pipe(debounceTime(200));

    combineLatest(this.bookmarkService.bookmarks$, filter$, this.isSorted, (allBookmarks, filter, sort) => {
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
        return bookmarks.sort((a, b) => b.dateAdded - a.dateAdded);
      }

      return bookmarks;

    })
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((bookmarks) => {
      this.bookmarks = bookmarks;
      this.changeDetector.detectChanges();
    });

    this.bookmarkService.getRootnode(READINGLIST_BOOKMARK_NAME);
    this.filter.next(undefined);
    this.isSorted.next(false);

    this.bookmarkService.bookmarks$.subscribe(() => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
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

  select(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.create({url: bookmark.url});
      this.removeBookmark(bookmark);
    });
  }

  applyFilter(filter: string) {
    this.filter.next(filter);
  }

  addCurrentPage() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0];
      this.bookmarkService.add({
        parentId: this.bookmarkService.readingListId,
        url: tab.url,
        title: tab.title,
      });
    });
  }

  randomBookmark() {
    const randomIndex = Math.floor(Math.random() * this.bookmarks.length);
    this.select(this.bookmarks[randomIndex]);
  }

  removeBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode) {
    this.bookmarkService.remove(bookmark);
  }

  sort() {
    this.isSorted.next(!this.isSorted.getValue());
  }
}
