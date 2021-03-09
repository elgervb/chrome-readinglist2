import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { VersionService } from '../../services/version/version.service';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

import { transform } from '@elgervb/mock-data';

describe('BookmarksComponent', () => {

  let fixture: ComponentFixture<BookmarksComponent>;
  let component: BookmarksComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        BookmarksComponent
      ],
      imports: [
        CommonModule
      ],
      providers: [
        BookmarkService,
        VersionService,
        ChangeDetectorRef,
        {
          provide: GoogleAnalyticsService, useValue: {
            create: jest.fn(),
            sendPageView: jest.fn(),
            sendEvent: jest.fn()
          }
        }
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

  describe('filtering', () => {
    let setFilterSpy: jest.SpyInstance;

    beforeEach(() => setFilterSpy = jest.spyOn(component.filter, 'next'))

    it('applies a filter', () => {
      component.applyFilter('my-filter');

      expect(setFilterSpy).toHaveBeenCalledWith('my-filter');
    });
  })

  describe('analytics', () => {

    let analyticsService: GoogleAnalyticsService;

    beforeEach(() => analyticsService = TestBed.inject(GoogleAnalyticsService));

    it('should sendEvent on addBookmark', () => {
      const queryMock: jest.Mock = chrome.tabs.query as jest.Mock;
      queryMock.mockImplementation((_, callback) => callback([{ url: 'https://url', title: 'title' }]));
      component.addBookmark();

      expect(analyticsService.sendEvent).toHaveBeenCalledWith('bookmarks', 'add', 'https://url');
    });

    it('should sendEvent on randomBookmark', () => {
      const bookmark = transform<chrome.bookmarks.BookmarkTreeNode>({
        url: 'https://url'
      });
      component.bookmarks = [bookmark];
      component.randomBookmark();

      expect(analyticsService.sendEvent).toHaveBeenCalledWith('bookmarks', 'random', 'https://url');
    });

    it('should sendEvent on reviewPopoverShown', () => {
      component.reviewPopoverShown(true);
      expect(analyticsService.sendEvent).toHaveBeenCalledWith('review', 'show popover');

      component.reviewPopoverShown(false);
      expect(analyticsService.sendEvent).toHaveBeenCalledWith('review', 'hide popover');
    });

    it('should sendEvent on openReview', () => {
      const queryMock: jest.Mock = chrome.tabs.query as jest.Mock;
      queryMock.mockImplementation((_, callback) => callback());

      component.openReview();
      expect(analyticsService.sendEvent).toHaveBeenCalledWith('review', 'redirect');
    });

    it('should sendEvent on setSorting', () => {
      component.setSorting('url');
      expect(analyticsService.sendEvent).toHaveBeenCalledWith('bookmarks', 'sort', 'url:desc');

      component.setSorting('url');
      expect(analyticsService.sendEvent).toHaveBeenCalledWith('bookmarks', 'sort', 'url:asc');
    });

  });
});
