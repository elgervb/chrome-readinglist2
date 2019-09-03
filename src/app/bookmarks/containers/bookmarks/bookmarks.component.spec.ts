import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../services/bookmark/bookmark.service';
import { VersionService } from '../../services/version/version.service';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { AnalyticsService } from 'src/app/core/analytics.service';

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;
  const analyticsService = {
    init: jest.fn(),
    sendAppView: jest.fn(),
    sendEvent: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BookmarksComponent
      ],
      imports: [
        CommonModule
      ],
      providers: [
        BookmarkService,
        VersionService,
        ChangeDetectorRef,
        { provide: AnalyticsService, useValue: analyticsService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
