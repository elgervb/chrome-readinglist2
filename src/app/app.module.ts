import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent, DEFAULT_IMAGE } from './app.component';
import { BookmarksService } from './bookmarks.service';

import { environment } from '../environments/environment';
import { LazyImgDirective, DEFAULT_LAZY_IMAGE } from './lazy-img.directive';
import { BookmarkitemComponent } from './bookmark/item/bookmarkitem.component';

@NgModule({
  declarations: [
    AppComponent,
    LazyImgDirective,
    BookmarkitemComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    BookmarksService,
    { provide: DEFAULT_LAZY_IMAGE, useValue: DEFAULT_IMAGE }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
