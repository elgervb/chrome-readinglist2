import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkListComponent } from './bookmark-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FaviconPipe } from '../../pipes/favicon.pipe';
import { createBookmark } from '../../test-utils';
import { By } from '@angular/platform-browser';

describe('BookmarkListComponent', () => {
  let component: BookmarkListComponent;
  let fixture: ComponentFixture<BookmarkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BookmarkListComponent,
        FaviconPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkListComponent);
    component = fixture.componentInstance;
    component.bookmarks = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show message if no bookmarks are present', () => {
    const noBookmarksEl = fixture.debugElement.query(By.css('.no-bookmarks'));
    expect(noBookmarksEl).toBeTruthy();
    expect(noBookmarksEl.nativeElement.textContent).toBe('No bookmarks present');
  });

  describe('render bookmarks', () => {
    const bookmark1 = createBookmark({ url: 'http://asf.asf' });
    const bookmark2 = createBookmark({ url: 'https:/qwr.qwre' });

    beforeEach(() => {
      const bookmarks = [
        bookmark1,
        bookmark2
      ];

      component.bookmarks = bookmarks;
      fixture.detectChanges();
    });

    it('should render bookmarks', () => {
      const listItems = fixture.debugElement.queryAll(By.css('li'));
      expect(listItems.length).toBe(2);

      expect(listItems[0].query(By.css('.url')).nativeElement.textContent).toBe(bookmark1.url);
      expect(listItems[1].query(By.css('.url')).nativeElement.textContent).toBe(bookmark2.url);
    });
  });
});
