import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyImgDirective, DEFAULT_LAZY_IMAGE } from './lazy-img.directive';
import { BookmarkService } from './bookmark.service';
import { BookmarkComponent } from './containers/bookmark.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BodyComponent } from './components/body/body.component';
import { BookmarkitemComponent } from './components/item/bookmarkitem.component';

export const DEFAULT_IMAGE = '/assets/bookmark-default.svg';

@NgModule({
  declarations: [
    BookmarkitemComponent,
    LazyImgDirective,
    BookmarkComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    BookmarkService,
    { provide: DEFAULT_LAZY_IMAGE, useValue: DEFAULT_IMAGE }
  ],
  exports: [
    BookmarkComponent
  ]
})
export class BookmarkModule { }
