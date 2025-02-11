import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Sorting } from '../../models/sorting';


@Component({
  selector: 'app-bookmark-header',
  templateUrl: './bookmark-header.component.html',
  styleUrls: [ './bookmark-header.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkHeaderComponent {

  readonly bookmarks = input<chrome.bookmarks.BookmarkTreeNode[]>(undefined);
  readonly sorting = input<Sorting>(undefined);
  readonly currentUrlExists = input<boolean>(undefined);
  readonly version = input<string>(undefined);
  readonly countBookmarks = input<number>(undefined);

  readonly addBookmark = output<void>();
  readonly sortEvent = output<void>();

}
