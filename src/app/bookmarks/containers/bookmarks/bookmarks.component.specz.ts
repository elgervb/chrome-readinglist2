import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';
import { BookmarkFooterComponent, BookmarkHeaderComponent, BookmarkListComponent } from '../../components';
import { FaviconPipe } from '../../pipes/favicon.pipe';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { VersionService } from '../../services/version/version.service';
import { ChangeDetectorRef } from '@angular/core';

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BookmarksComponent,
        BookmarkFooterComponent,
        BookmarkHeaderComponent,
        BookmarkListComponent,
        FaviconPipe
      ],
      imports: [
        CommonModule
      ],
      providers: [
        BookmarkService,
        VersionService,
        ChangeDetectorRef
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
