import { ChangeDetectionStrategy, Component, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-bookmark-footer',
  templateUrl: './bookmark-footer.component.html',
  styleUrls: [ './bookmark-footer.component.css' ],
  imports: [ ReactiveFormsModule ],
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

  readonly filterInput = new FormControl<string>('');

  constructor() {
    this.filterInput.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe(value => this.filterEvent.emit(value));
  }

  showPopover(): void {
    this.displayPopover.set(!this.displayPopover());
    this.reviewPopoverShowEvent.emit(this.displayPopover());
  }

}
