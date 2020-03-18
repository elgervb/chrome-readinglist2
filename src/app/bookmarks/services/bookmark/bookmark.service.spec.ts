import { TestBed } from '@angular/core/testing';

import { BookmarkService, OTHER_BOOKMARKS } from './bookmark.service';
import { BookmarkFolderToken } from '../bookmark-folder.token';

describe('BookmarkService', () => {

  let service: BookmarkService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: BookmarkFolderToken, useValue: '/test' }
    ]
  }));

  beforeEach(() => service = TestBed.inject(BookmarkService));

  afterEach(() => jest.resetAllMocks());
  it('should be created', () => {
    expect(service).toBeTruthy();
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

    service.load();

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

    service.load();

    expect(service.readingListId).toBe('3');
    expect(chrome.bookmarks.getTree).toHaveBeenCalledTimes(1);
  });
});
