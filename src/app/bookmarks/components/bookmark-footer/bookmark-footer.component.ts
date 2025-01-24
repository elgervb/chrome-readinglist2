import { Component, EventEmitter, Output, TemplateRef, ViewChild, input } from '@angular/core';
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

  @Output() readonly filterEvent = new EventEmitter<string>();
  @Output() readonly randomBookmarkEvent = new EventEmitter<void>();
  @Output() readonly reviewPopoverShowEvent = new EventEmitter<boolean>();
  @Output() readonly openReviewEvent = new EventEmitter<void>();

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
