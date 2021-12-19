import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksComponent } from './containers';
import { BookmarkFooterComponent, BookmarkHeaderComponent, BookmarkListComponent } from './components';
import { BookmarksRoutingModule } from './bookmarks-routing.module';
import { FaviconPipe } from './pipes/favicon.pipe';
import { DEFAULT_LAZY_IMAGE, LazyImgDirective } from './directives';

export const DEFAULT_IMAGE = '/assets/bookmark-default.svg';

@NgModule({
  declarations: [
    BookmarksComponent,
    BookmarkListComponent,
    BookmarkHeaderComponent,
    BookmarkFooterComponent,
    FaviconPipe,
    LazyImgDirective
  ],
  imports: [
    CommonModule,
    BookmarksRoutingModule
  ],
  providers: [ { provide: DEFAULT_LAZY_IMAGE, useValue: DEFAULT_IMAGE } ]
})
export class BookmarksModule { }
