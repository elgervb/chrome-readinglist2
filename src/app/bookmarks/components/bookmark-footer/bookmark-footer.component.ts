import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-bookmark-footer',
    templateUrl: './bookmark-footer.component.html',
    styleUrls: ['./bookmark-footer.component.css'],
    standalone: false
})
export class BookmarkFooterComponent {

  @Input() filter?: string;
  @Input() bookmarks: chrome.bookmarks.BookmarkTreeNode[];

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
