import { BookmarksComponent } from './bookmarks.component';
import { CommonModule } from '@angular/common';

import { VersionService } from '../../services/version/version.service';
import { GoogleAnalyticsService } from '@core/google-analytics.service';


import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponents } from 'ng-mocks';
import { BookmarkFooterComponent, BookmarkHeaderComponent, BookmarkListComponent } from '../../components';

describe('BookmarksComponent', () => {
  let spectator: Spectator<BookmarksComponent>;

  const createComponent = createComponentFactory({
    component: BookmarksComponent,
    imports: [ CommonModule, MockComponents(BookmarkListComponent, BookmarkHeaderComponent, BookmarkFooterComponent) ],
    mocks: [ VersionService ]
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('filtering', () => {
    let setFilterSpy: jest.SpyInstance;

    beforeEach(() => setFilterSpy = jest.spyOn(spectator.component.filter, 'set'));

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

      expect(analyticsSend).toHaveBeenCalledWith('bookmarks', 'add', 'https://url');
    });

    // it('should sendEvent on randomBookmark', () => {
    //   const bookmark = transform<chrome.bookmarks.BookmarkTreeNode>({
    //     url: 'https://url'
    //   });
    //   jest.spyOn(spectator.inject(BookmarkService), 'load').mockReturnValueOnce(new BehaviorSubject([ bookmark ]));
    //   spectator.component.randomBookmark();

    //   expect(analyticsSend).toHaveBeenCalledWith('bookmarks', 'random', 'https://url');
    // });

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
