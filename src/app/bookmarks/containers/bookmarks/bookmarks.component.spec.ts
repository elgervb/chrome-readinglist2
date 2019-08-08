import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';
import { BehaviorSubject } from 'rxjs';
import { Bookmark } from '../../models';
import { BookmarkServiceProvider } from '../../services/bookmark/bookmark.factory';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { BookmarkFooterComponent, BookmarkHeaderComponent, BookmarkListComponent } from '../../components';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { FaviconPipe } from '../../pipes/favicon.pipe';

const bookmarkService: BookmarkService = {
  add: jest.fn(),
  remove: jest.fn(),
  select: jest.fn(),
  bookmarks$: new BehaviorSubject<Bookmark[]>([])
};

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BookmarksComponent,
        BookmarkFooterComponent,
        BookmarkHeaderComponent,
        BookmarkListComponent,
        FaviconPipe
      ],
      providers: [
        { provide: BookmarkServiceProvider, useValue: bookmarkService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
