import { FaviconPipe } from './favicon.pipe';

describe('FaviconPipe', () => {
  let pipe: FaviconPipe;

  beforeEach(() => pipe = new FaviconPipe());

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null when not passing a bookmark', () => {
    expect(pipe.transform(null)).toBe(null);
  });

  it('should return null when not passing a bookmark with an url', () => {
    const bookmark: chrome.bookmarks.BookmarkTreeNode = {
      title: 'should return null when not passing a bookmark with an url',
      id: '1',
      url: undefined
    };
    expect(pipe.transform(bookmark)).toBe(null);
  });

  it('should return the favicon url', () => {
    const url = 'http://google.com';
    const bookmark: chrome.bookmarks.BookmarkTreeNode = {
      title: 'should return null when not passing a bookmark with an url',
      id: '1',
      url
    };
    expect(pipe.transform(bookmark)).toBe(`${url}/favicon.ico`);
  });

  it('should return the favicon url with portnumber', () => {
    const url = 'http://google.com:8080';
    const bookmark: chrome.bookmarks.BookmarkTreeNode = {
      title: 'should return null when not passing a bookmark with an url',
      id: '1',
      url
    };
    expect(pipe.transform(bookmark)).toBe(`${url}/favicon.ico`);
  });
});
