import { BookmarkListComponent } from './bookmark-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FaviconPipe } from '../../pipes/favicon.pipe';
import { createBookmark } from '../../test-utils';
import { By } from '@angular/platform-browser';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

describe('BookmarkListComponent', () => {
  let spectator: Spectator<BookmarkListComponent>;
  const createComponent = createComponentFactory({
    component: BookmarkListComponent,
    imports: [ FaviconPipe ],
    schemas: [ NO_ERRORS_SCHEMA ] // TODO: no NO_ERRORS_SCHEMA
  });

  beforeEach(() => spectator = createComponent({ props: { bookmarks: [] } }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show message if no bookmarks are present', () => {
    const noBookmarksEl = spectator.fixture.debugElement.query(By.css('.no-bookmarks'));
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

      spectator.setInput('bookmarks', bookmarks);
      spectator.fixture.detectChanges();
    });

    it('should render bookmarks', () => {
      const listItems = spectator.fixture.debugElement.queryAll(By.css('li'));
      expect(listItems.length).toBe(2);

      expect(listItems[0].query(By.css('.url')).nativeElement.textContent).toBe(bookmark1.url);
      expect(listItems[1].query(By.css('.url')).nativeElement.textContent).toBe(bookmark2.url);
    });
  });

});
