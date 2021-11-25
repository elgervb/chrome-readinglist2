import { InjectionToken } from '@angular/core';
import { environment } from '@env/environment';

const READING_LIST_FOLDER_TITLE = 'My ReadingList';

export const BookmarkFolderToken = new InjectionToken<string>('BookmarkFolderToken',
  {
    providedIn: 'root',
    factory: () => environment.production ? READING_LIST_FOLDER_TITLE : READING_LIST_FOLDER_TITLE + '_DEV'
  });
