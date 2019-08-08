import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Bookmark } from '../../models';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.css']
})
export class BookmarkListComponent implements OnInit {

  @Input() bookmarks: Bookmark[];

  @Output() selectEvent = new EventEmitter<Bookmark>();

  constructor() { }

  ngOnInit() {
  }

}
