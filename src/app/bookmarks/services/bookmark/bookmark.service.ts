import { Observable } from 'rxjs';
import { Bookmark } from '../../models';

export interface BookmarkService {

  readonly bookmarks$: Observable<Bookmark[]>;

  add(url: string, title?: string): void;

  select(bookmark: Bookmark): void;

  remove(bookmark: Bookmark): void;

}
