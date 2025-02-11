import { ChangeDetectionStrategy, Component, input, output, signal, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-bookmark-footer',
  templateUrl: './bookmark-footer.component.html',
  styleUrls: [ './bookmark-footer.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkFooterComponent {

  readonly filter = input<string>(undefined);
  readonly bookmarks = input<chrome.bookmarks.BookmarkTreeNode[]>([]);

  readonly filterEvent = output<string>();
  readonly randomBookmarkEvent = output<void>();
  readonly reviewPopoverShowEvent = output<boolean>();
  readonly openReviewEvent = output<void>();

  readonly popoverRef = viewChild<TemplateRef<HTMLElement>>('popoverTemplate');

  readonly displayPopover = signal(false);

  emitFilterEvent(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    this.filterEvent.emit(target.value);
  }

  showPopover(): void {
    this.displayPopover.set(!this.displayPopover());
    this.reviewPopoverShowEvent.emit(this.displayPopover());
  }

}
