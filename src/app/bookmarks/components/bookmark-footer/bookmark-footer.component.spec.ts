
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

  it('should emit random bookmark event', () => {
    let emit = false;
    spectator.component.randomBookmarkEvent.subscribe(() => emit = true);

    const button = spectator.fixture.debugElement.query(By.css('.btn-random'));
    expect(button).toBeTruthy();
    button.triggerEventHandler('click', void 0);

    expect(emit).toBe(true);
  });

  it('should emit filter event', () => {
    let emit = '';
    spectator.component.filterEvent.subscribe((val: string) => emit = val);

    const input = spectator.fixture.debugElement.query(By.css('.filter'));
    expect(input).toBeTruthy();
    input.triggerEventHandler('input', {
      target: {
        value: 'abc'
      }
    });

    expect(emit).toBe('abc');
  });

  it('should show popup', () => {
    const emitSpy = jest.spyOn(spectator.component.reviewPopoverShowEvent, 'emit');

    spectator.component.showPopover();
    expect(emitSpy).toHaveBeenCalledWith(true);

    spectator.component.showPopover();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

});
