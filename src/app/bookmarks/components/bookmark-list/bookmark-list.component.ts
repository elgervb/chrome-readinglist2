import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LazyImgDirective } from '../../directives/lazy-img.directive';
import { FaviconPipe } from '../../pipes/favicon.pipe';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: [ './bookmark-list.component.css' ],
  imports: [ LazyImgDirective, DatePipe, FaviconPipe ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkListComponent {

  readonly bookmarks = input<chrome.bookmarks.BookmarkTreeNode[]>(undefined);
  readonly countBookmarks = input<number>(undefined);

  readonly selectEvent = output<chrome.bookmarks.BookmarkTreeNode>();
  readonly clearFilter = output<void>();

}
