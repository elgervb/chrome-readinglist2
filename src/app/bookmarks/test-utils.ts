export function createBookmark(args?: { url: string }): chrome.bookmarks.BookmarkTreeNode {
  return {
    id: guid(),
    title: guid(),
    url: args?.url ? args.url : `http://${guid()}`
  };
}

export function guid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {

    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
