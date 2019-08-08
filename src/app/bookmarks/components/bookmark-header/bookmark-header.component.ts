import { Component, OnInit, Input } from '@angular/core';
import { Bookmark } from '../../models';

@Component({
  selector: 'app-bookmark-header',
  templateUrl: './bookmark-header.component.html',
  styleUrls: ['./bookmark-header.component.css']
})
export class BookmarkHeaderComponent implements OnInit {

  @Input() bookmarks: Bookmark[];

  constructor() { }

  ngOnInit() {
  }

}
