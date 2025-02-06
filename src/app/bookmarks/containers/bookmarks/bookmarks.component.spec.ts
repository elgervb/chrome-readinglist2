import { BookmarksComponent } from './bookmarks.component';
import { CommonModule } from '@angular/common';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VersionService } from '../../services/version/version.service';
import { GoogleAnalyticsService } from '@core/google-analytics.service';

import { transform } from '@elgervb/mock-data';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

describe('BookmarksComponent', () => {
  let spectator: Spectator<BookmarksComponent>;
  const versionService: Partial<VersionService> = {
    getVersion: () => '1.0.0'
  };

  const createComponent = createComponentFactory({
    component: BookmarksComponent,
    imports: [ CommonModule ],
    providers: [ { provide: VersionService, useValue: versionService } ], // TODO: use mock
    schemas: [ NO_ERRORS_SCHEMA ] // TODO: no NO_ERRORS_SCHEMA
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('filtering', () => {
    let setFilterSpy: jest.SpyInstance;

    beforeEach(() => setFilterSpy = jest.spyOn(spectator.component.filter$, 'next'));

    it('applies a filter', () => {
      spectator.component.applyFilter('my-filter');

      expect(setFilterSpy).toHaveBeenCalledWith('my-filter');
    });
  });

  describe('analytics', () => {

    let analyticsService: GoogleAnalyticsService;
    let analyticsSend: jest.SpyInstance;

    beforeEach(() => {
      analyticsService = spectator.inject(GoogleAnalyticsService);
      analyticsSend = jest.spyOn(analyticsService, 'sendEvent');
    });

    it('should sendEvent on addBookmark', () => {
      const queryMock: jest.Mock = chrome.tabs.query as jest.Mock;
      queryMock.mockImplementation((_, callback) => callback([ { url: 'https://url', title: 'title' } ]));
      spectator.component.addBookmark();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(analyticsSend).toHaveBeenCalledWith('bookmarks', 'add', 'https://url');
    });

    it('should sendEvent on randomBookmark', () => {
      const bookmark = transform<chrome.bookmarks.BookmarkTreeNode>({
        url: 'https://url'
      });
      spectator.component.bookmarks = [ bookmark ];
      spectator.component.randomBookmark();

      expect(analyticsSend).toHaveBeenCalledWith('bookmarks', 'random', 'https://url');
    });

    it('should sendEvent on reviewPopoverShown', () => {
      spectator.component.reviewPopoverShown(true);
      expect(analyticsSend).toHaveBeenCalledWith('review', 'show popover');

      spectator.component.reviewPopoverShown(false);
      expect(analyticsSend).toHaveBeenCalledWith('review', 'hide popover');
    });

    it('should sendEvent on openReview', () => {
      const queryMock: jest.Mock = chrome.tabs.query as jest.Mock;
      queryMock.mockImplementation((_, callback) => callback());

      spectator.component.openReview();
      expect(analyticsSend).toHaveBeenCalledWith('review', 'redirect');
    });

    it('should sendEvent on setSorting', () => {
      spectator.component.setSorting('url');
      expect(analyticsSend).toHaveBeenCalledWith('bookmarks', 'sort', 'url:desc');

      spectator.component.setSorting('url');
      expect(analyticsSend).toHaveBeenCalledWith('bookmarks', 'sort', 'url:asc');
    });

  });
});
