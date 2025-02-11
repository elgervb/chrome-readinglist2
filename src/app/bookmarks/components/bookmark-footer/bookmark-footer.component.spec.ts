
import { BookmarkFooterComponent } from './bookmark-footer.component';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

describe('BookmarkFooterComponent', () => {
  let spectator: Spectator<BookmarkFooterComponent>;
  const createComponent = createComponentFactory(BookmarkFooterComponent);

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should emit random bookmark event', done => {
    spectator.component.randomBookmarkEvent.subscribe(() => {
      done();
    });

    const button = spectator.query<HTMLButtonElement>('.btn-random');
    expect(button).toBeTruthy();
    expect(button.disabled).toBeTruthy();

    spectator.setInput('bookmarks', [ { id: '1', title: 'abc', url: 'http://abc.com' } ]);
    expect(button.disabled).toBeFalsy();

    spectator.click('.btn-random');
  });

  it('should emit filter event', done => {
    spectator.component.filterEvent.subscribe((val: string) => {
      expect(val).toBe('abc');
      done();
    });

    const input = spectator.query<HTMLInputElement>('.filter');
    expect(input).toBeTruthy();
    spectator.triggerEventHandler('.filter', 'input', {
      target: {
        value: 'abc'
      }
    });


  });

  it('should show popup', () => {
    const emitSpy = jest.spyOn(spectator.component.reviewPopoverShowEvent, 'emit');

    spectator.component.showPopover();
    expect(emitSpy).toHaveBeenCalledWith(true);

    spectator.component.showPopover();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

});
