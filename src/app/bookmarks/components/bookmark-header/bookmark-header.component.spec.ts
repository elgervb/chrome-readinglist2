
import { BookmarkHeaderComponent } from './bookmark-header.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { createBookmark } from '../../test-utils';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

describe('BookmarkHeaderComponent', () => {
  let spectator: Spectator<BookmarkHeaderComponent>;
  const createComponent = createComponentFactory(BookmarkHeaderComponent);

  beforeEach(() => spectator = createComponent({ props: { bookmarks: [], sorting: { asc: true, field: 'title' }, version: '1.0.0' } }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show how many bookmarks are present on screen', () => {
    spectator.setInput({ countBookmarks: 4, bookmarks: [ createBookmark(), createBookmark() ] });
    spectator.fixture.detectChanges();

    expect(spectator.fixture.debugElement.query(By.css('.currentCount')).nativeElement.textContent)
      .toBe('2');
    expect(spectator.fixture.debugElement.query(By.css('.totalCount')).nativeElement.textContent)
      .toBe(' / 4');
  });

  it('should show the version', () => {
    const version = '99.99.12';
    spectator.setInput('version', version);
    spectator.fixture.detectChanges();

    expect(spectator.fixture.debugElement.query(By.css('.version')).nativeElement.textContent)
      .toBe(`v${version}`);
  });

  describe('sorting', () => {
    let sortBtn: DebugElement;

    beforeEach(() => {
      sortBtn = spectator.fixture.debugElement.query(By.css('.icon--sort'));
      expect(sortBtn).toBeTruthy();
    });

    it('should emit a sort event', () => {
      let emit = false;
      spectator.component.sortEvent.subscribe(() => emit = true);

      sortBtn.triggerEventHandler('click', {});
      expect(emit).toBe(true);
    });

    it('should show in ascending order', () => {
      spectator.setInput('sorting', { asc: true, field: 'title' });
      spectator.fixture.detectChanges();

      expect(spectator.fixture.debugElement.query(By.css('.icon--sort__asc'))).toBeTruthy();
      expect(spectator.fixture.debugElement.query(By.css('.icon--sort__desc'))).toBeFalsy();
    });

    it('should show in descending order', () => {
      spectator.setInput('sorting', { asc: false, field: 'title' });
      spectator.fixture.detectChanges();

      expect(spectator.fixture.debugElement.query(By.css('.icon--sort__asc'))).toBeFalsy();
      expect(spectator.fixture.debugElement.query(By.css('.icon--sort__desc'))).toBeTruthy();
    });

  });

  describe('add bookmark', () => {
    let addBtn: DebugElement;

    beforeEach(() => {
      addBtn = spectator.fixture.debugElement.query(By.css('.btn-add'));
      expect(addBtn).toBeTruthy();
    });

    it('should disable add button when url exists', () => {
      expect(addBtn.attributes).not.toContain('disabled');
    });

    it('should emit a add bookmark event', () => {
      let emit = false;
      spectator.component.addBookmark.subscribe(() => emit = true);

      addBtn.triggerEventHandler('click', {});
      expect(emit).toBe(true);
    });
  });
});
