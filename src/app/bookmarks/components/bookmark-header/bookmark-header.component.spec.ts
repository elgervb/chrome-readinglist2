import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkHeaderComponent } from './bookmark-header.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { createBookmark } from '../../test-utils';

describe('BookmarkHeaderComponent', () => {
  let component: BookmarkHeaderComponent;
  let fixture: ComponentFixture<BookmarkHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarkHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkHeaderComponent);
    component = fixture.componentInstance;
    component.bookmarks = [];
    component.sorting = {
      asc: true,
      field: 'title'
    };
    component.version = '1.0.0';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show how many bookmarks are present on screen', () => {
    component.countBookmarks = 4;
    component.bookmarks = [createBookmark(), createBookmark()];
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.currentCount')).nativeElement.textContent)
      .toBe('2');
    expect(fixture.debugElement.query(By.css('.totalCount')).nativeElement.textContent)
      .toBe(' / 4');
  });

  it('should show the version', () => {
    const version = '99.99.12';
    component.version = version;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.version')).nativeElement.textContent)
      .toBe(`v${version}`);
  });

  describe('sorting', () => {
    let sortBtn: DebugElement;

    beforeEach(() => {
      sortBtn = fixture.debugElement.query(By.css('.icon--sort'));
      expect(sortBtn).toBeTruthy();
    });

    it('should emit a sort event', () => {
      let emit = false;
      component.sortEvent.subscribe(() => emit = true);

      sortBtn.triggerEventHandler('click', {});
      expect(emit).toBe(true);
    });

    it('should show in ascending order', () => {
      component.sorting = { asc: true, field: 'title' };
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.icon--sort__asc'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.icon--sort__desc'))).toBeFalsy();
    });

    it('should show in descending order', () => {
      component.sorting = { asc: false, field: 'title' };
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.icon--sort__asc'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.icon--sort__desc'))).toBeTruthy();
    });

  });

  describe('add bookmark', () => {
    let addBtn: DebugElement;

    beforeEach(() => {
      addBtn = fixture.debugElement.query(By.css('.btn-add'));
      expect(addBtn).toBeTruthy();
    });

    it('should disable add button when url exists', () => {
      expect(addBtn.attributes).not.toContain('disabled');
    });

    it('should emit a add bookmark event', () => {
      let emit = false;
      component.addBookmark.subscribe(() => emit = true);

      addBtn.triggerEventHandler('click', {});
      expect(emit).toBe(true);
    });
  });
});
