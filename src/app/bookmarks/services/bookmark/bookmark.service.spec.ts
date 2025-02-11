import { BookmarkService, OTHER_BOOKMARKS } from './bookmark.service';
import { bookmarkFolderToken } from '../bookmark-folder.token';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

describe('BookmarkService', () => {
  let spectator: SpectatorService<BookmarkService>;
  const createService = createServiceFactory({
    service: BookmarkService,
    providers: [ { provide: bookmarkFolderToken, useValue: '/test' } ]
  });


  beforeEach(() => spectator = createService());

  afterEach(() => jest.resetAllMocks());

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should create root bookmark folder', () => {
    const bookmarks: chrome.bookmarks.BookmarkTreeNode[] = [
      {
        title: 'root',
        id: '1',
        children: [
          {
            title: OTHER_BOOKMARKS,
            id: '2',
            children: [
              {
                title: '/noop',
                id: '3',
                children: []
              }
            ]
          }
        ]
      }
    ];
    let createBookmark: chrome.bookmarks.BookmarkTreeNode;
    (chrome.bookmarks.getTree as jest.Mock).mockImplementation(callback => callback(bookmarks));
    (chrome.bookmarks.create as jest.Mock).mockImplementation((bookmark, callback) => {
      createBookmark = bookmark;
      callback();
    });

    spectator.service.load();

    expect(chrome.bookmarks.getTree).toHaveBeenCalledTimes(1);
    expect(chrome.bookmarks.create).toHaveBeenCalledTimes(1);
    expect(createBookmark).toEqual({ title: '/test', parentId: '2' });
  });

  it('should load bookmarks', () => {
    const bookmarks: chrome.bookmarks.BookmarkTreeNode[] = [
      {
        title: 'root',
        id: '1',
        children: [
          {
            title: OTHER_BOOKMARKS,
            id: '2',
            children: [
              {
                title: '/test',
                id: '3',
                children: []
              }
            ]
          }
        ]
      }
    ];
    (chrome.bookmarks.getTree as jest.Mock).mockImplementation(callback => callback(bookmarks));

    spectator.service.load();

    expect(spectator.service.readingListId).toBe('3');
    expect(chrome.bookmarks.getTree).toHaveBeenCalledTimes(1);
  });
});
