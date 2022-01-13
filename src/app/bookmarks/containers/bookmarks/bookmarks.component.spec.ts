import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';
import { CommonModule } from '@angular/common';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VersionService } from '../../services/version/version.service';

describe('BookmarksComponent', () => {

  let fixture: ComponentFixture<BookmarksComponent>;
  let component: BookmarksComponent;
  const versionService: Partial<VersionService> = {
    getVersion: () => '1.0.0'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarksComponent ],
      imports: [ CommonModule ],
      providers: [ { provide: VersionService, useValue: versionService } ],
      schemas: [ NO_ERRORS_SCHEMA ]
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

    beforeEach(() => setFilterSpy = jest.spyOn(component.filter$, 'next'));

    it('applies a filter', () => {
      component.applyFilter('my-filter');

      expect(setFilterSpy).toHaveBeenCalledWith('my-filter');
    });
  });

  // describe('analytics', () => {

  //   let analyticsService: GoogleAnalyticsService;

  //   beforeEach(() => analyticsService = TestBed.inject(GoogleAnalyticsService));

  //   it('should sendEvent on addBookmark', () => {
  //     const queryMock: jest.Mock = chrome.tabs.query as jest.Mock;
  //     queryMock.mockImplementation((_, callback) => callback([{ url: 'https://url', title: 'title' }]));
  //     component.addBookmark();

  //     expect(analyticsService.sendEvent).toHaveBeenCalledWith('bookmarks', 'add', 'https://url');
  //   });

  // it('should sendEvent on randomBookmark', () => {
  //   const bookmark = transform<chrome.bookmarks.BookmarkTreeNode>({
  //     url: 'https://url'
  //   });
  //   component.bookmarks = [bookmark];
  //   component.randomBookmark();

  //   expect(analyticsService.sendEvent).toHaveBeenCalledWith('bookmarks', 'random', 'https://url');
  // });

  // it('should sendEvent on reviewPopoverShown', () => {
  //   component.reviewPopoverShown(true);
  //   expect(analyticsService.sendEvent).toHaveBeenCalledWith('review', 'show popover');

  //   component.reviewPopoverShown(false);
  //   expect(analyticsService.sendEvent).toHaveBeenCalledWith('review', 'hide popover');
  // });

  // it('should sendEvent on openReview', () => {
  //   const queryMock: jest.Mock = chrome.tabs.query as jest.Mock;
  //   queryMock.mockImplementation((_, callback) => callback());

  //   component.openReview();
  //   expect(analyticsService.sendEvent).toHaveBeenCalledWith('review', 'redirect');
  // });

  // it('should sendEvent on setSorting', () => {
  //   component.setSorting('url');
  //   expect(analyticsService.sendEvent).toHaveBeenCalledWith('bookmarks', 'sort', 'url:desc');

  //   component.setSorting('url');
  //   expect(analyticsService.sendEvent).toHaveBeenCalledWith('bookmarks', 'sort', 'url:asc');
  // });

  // });
});
