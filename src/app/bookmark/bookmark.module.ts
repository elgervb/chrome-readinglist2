import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyImgDirective, DEFAULT_LAZY_IMAGE } from './lazy-img.directive';
import { BookmarkitemComponent } from './item/bookmarkitem.component';
import { BookmarkService } from './bookmark.service';

export const DEFAULT_IMAGE = '/assets/bookmark-default.svg';

@NgModule({
  declarations: [
    BookmarkitemComponent,
    LazyImgDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
    BookmarkService,
    { provide: DEFAULT_LAZY_IMAGE, useValue: DEFAULT_IMAGE }
  ],
  exports: [
    BookmarkitemComponent
  ]
})
export class BookmarkModule { }
