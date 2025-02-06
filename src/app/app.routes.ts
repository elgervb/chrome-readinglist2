import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./bookmarks/bookmarks.module').then(m => m.BookmarksModule)
  }
];
