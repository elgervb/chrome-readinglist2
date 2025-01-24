import { Component, TemplateRef, ViewChild, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-bookmark-footer',
    templateUrl: './bookmark-footer.component.html',
    styleUrls: ['./bookmark-footer.component.css'],
    imports: [NgTemplateOutlet]
})
export class BookmarkFooterComponent {

  readonly filter = input<string>(undefined);
  readonly bookmarks = input<chrome.bookmarks.BookmarkTreeNode[]>(undefined);

  readonly filterEvent = output<string>();
  readonly randomBookmarkEvent = output<void>();
  readonly reviewPopoverShowEvent = output<boolean>();
  readonly openReviewEvent = output<void>();

  @ViewChild('popoverTemplate') popoverRef: TemplateRef<HTMLElement>;

  displayPopover = false;

  showPopover() {
    this.displayPopover = !this.displayPopover;
    this.reviewPopoverShowEvent.emit(this.displayPopover);
  }

  emitFilterEvent(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    this.filterEvent.emit(target.value);
  }

}
