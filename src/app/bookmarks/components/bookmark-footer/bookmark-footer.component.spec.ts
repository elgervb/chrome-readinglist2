
import { BookmarkFooterComponent } from './bookmark-footer.component';
import { By } from '@angular/platform-browser';

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
      const button = spectator.fixture.debugElement.query(By.css('.btn-random'));
      expect(button).toBeTruthy();
      button.triggerEventHandler('click', void 0);
      done();
    });
  });

  it('should emit filter event', done => {
    spectator.component.filterEvent.subscribe((val: string) => {
      const input = spectator.fixture.debugElement.query(By.css('.filter'));
      expect(input).toBeTruthy();
      input.triggerEventHandler('input', {
        target: {
          value: 'abc'
        }
      });
      expect(val).toBe('abc');
      done();
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
