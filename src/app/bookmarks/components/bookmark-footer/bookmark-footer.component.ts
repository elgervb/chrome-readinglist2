import { Component, input, output, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-bookmark-footer',
  templateUrl: './bookmark-footer.component.html',
  styleUrls: [ './bookmark-footer.component.css' ]
})
export class BookmarkFooterComponent {

  readonly filter = input<string>(undefined);
  readonly bookmarks = input<chrome.bookmarks.BookmarkTreeNode[]>(undefined);

  readonly filterEvent = output<string>();
  readonly randomBookmarkEvent = output<void>();
  readonly reviewPopoverShowEvent = output<boolean>();
  readonly openReviewEvent = output<void>();

  readonly popoverRef = viewChild<TemplateRef<HTMLElement>>('popoverTemplate');

  displayPopover = false; // TODO: as a signal #127

  showPopover(): void {
    this.displayPopover = !this.displayPopover;
    this.reviewPopoverShowEvent.emit(this.displayPopover);
  }

  emitFilterEvent(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    this.filterEvent.emit(target.value);
  }

}
